const Router = require('koa-router');
const crypto = require('crypto');
const multer = require('@koa/multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config');
const { getAccessToken, getAccessTokenByApp } = require('../utils/token');
const { getOAuthUrl, getUserByCode, createDraft, publishDraft } = require('../utils/wechat');
const { fetchHotNews } = require('../utils/hotNews');
const { generateArticle } = require('../utils/ai');

// multer 配置：临时存储上传文件
const upload = multer({ dest: 'uploads/' });

const router = new Router({ prefix: '/wechat' });

/**
 * 从请求头提取前端传入的 token
 * 优先使用 Authorization header，无则返回 null
 */
function extractToken(ctx) {
  const auth = ctx.get('Authorization');
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

/**
 * 服务器验证（GET）
 * 微信服务器会请求此接口验证有效性
 */
router.get('/verify', (ctx) => {
  const { signature, timestamp, nonce, echostr } = ctx.query;

  const arr = [config.token, timestamp, nonce].sort();
  const hash = crypto.createHash('sha1').update(arr.join('')).digest('hex');

  if (hash === signature) {
    ctx.body = echostr;
    console.log('[验证] 服务器验证成功');
  } else {
    ctx.status = 403;
    ctx.body = '验证失败';
    console.log('[验证] 服务器验证失败');
  }
});

/**
 * 接收消息/事件（POST）
 */
router.post('/message', async (ctx) => {
  // TODO: 解析 XML 并处理消息
  console.log('[消息] 收到消息:', ctx.request.body);
  ctx.body = 'success';
});

/**
 * 获取 OAuth 授权链接
 */
router.get('/oauth/url', (ctx) => {
  const { redirect_uri, scope, state } = ctx.query;

  if (!redirect_uri) {
    ctx.status = 400;
    ctx.body = { error: '缺少 redirect_uri 参数' };
    return;
  }

  const url = getOAuthUrl(redirect_uri, scope, state);
  ctx.body = { url };
});

/**
 * OAuth 回调（用 code 换用户信息）
 */
router.get('/oauth/callback', async (ctx) => {
  const { code } = ctx.query;

  if (!code) {
    ctx.status = 400;
    ctx.body = { error: '缺少 code 参数' };
    return;
  }

  try {
    const userInfo = await getUserByCode(code);
    ctx.body = { success: true, data: userInfo };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

/**
 * 获取 access_token（前端传入 AppID/AppSecret）
 */
router.post('/token', async (ctx) => {
  const { app_id, app_secret } = ctx.request.body;

  if (!app_id || !app_secret) {
    ctx.status = 400;
    ctx.body = { success: false, error: '缺少 app_id 或 app_secret 参数' };
    return;
  }

  try {
    const result = await getAccessTokenByApp(app_id, app_secret);
    ctx.body = {
      success: true,
      access_token: result.access_token,
      expires_in: result.expires_in
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

/**
 * 上传素材（封面图）
 */
router.post('/upload', upload.single('media'), async (ctx) => {
  if (!ctx.file) {
    ctx.status = 400;
    ctx.body = { success: false, error: '请选择文件' };
    return;
  }

  try {
    const frontendToken = extractToken(ctx);
    const token = frontendToken || await getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`;

    // 构建 multipart form
    const form = new FormData();
    form.append('media', fs.createReadStream(ctx.file.path), ctx.file.originalname);

    const { data } = await axios.post(url, form, {
      headers: form.getHeaders()
    });

    // 清理临时文件
    fs.unlinkSync(ctx.file.path);

    if (data.errcode) {
      ctx.status = 500;
      ctx.body = { success: false, error: `上传失败: ${data.errmsg}` };
      return;
    }

    ctx.body = { success: true, media_id: data.media_id };
  } catch (err) {
    // 清理临时文件
    if (ctx.file && ctx.file.path) {
      try { fs.unlinkSync(ctx.file.path); } catch (e) {}
    }
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

/**
 * 创建草稿
 */
router.post('/draft', async (ctx) => {
  const { articles } = ctx.request.body;

  if (!articles || !Array.isArray(articles)) {
    ctx.status = 400;
    ctx.body = { error: 'articles 参数必须是数组' };
    return;
  }

  try {
    const frontendToken = extractToken(ctx);
    const mediaId = await createDraft(articles, frontendToken);
    ctx.body = { success: true, media_id: mediaId };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

/**
 * 发布草稿
 */
router.post('/publish', async (ctx) => {
  const { media_id } = ctx.request.body;

  if (!media_id) {
    ctx.status = 400;
    ctx.body = { error: '缺少 media_id 参数' };
    return;
  }

  try {
    const frontendToken = extractToken(ctx);
    const publishId = await publishDraft(media_id, frontendToken);
    ctx.body = { success: true, publish_id: publishId };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

/**
 * 获取当日热点新闻
 */
router.get('/hot-news', async (ctx) => {
  try {
    const news = await fetchHotNews();
    ctx.body = { success: true, data: news };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

/**
 * AI 根据热点生成文章
 */
router.post('/ai/generate-article', async (ctx) => {
  const { title, description } = ctx.request.body;

  if (!title) {
    ctx.status = 400;
    ctx.body = { success: false, error: '缺少 title 参数' };
    return;
  }

  try {
    const article = await generateArticle(title, description || '');
    ctx.body = { success: true, data: article };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { success: false, error: err.message };
  }
});

module.exports = router;
