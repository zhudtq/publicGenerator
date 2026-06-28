const axios = require('axios');
const config = require('../config');

// Token 缓存
let tokenCache = {
  accessToken: '',
  expiresAt: 0
};

/**
 * 获取 access_token
 * 文档: https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
async function getAccessToken() {
  // 检查缓存是否有效（提前 5 分钟刷新）
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt - 300000) {
    return tokenCache.accessToken;
  }

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`;

  const { data } = await axios.get(url);

  if (data.access_token) {
    tokenCache.accessToken = data.access_token;
    tokenCache.expiresAt = Date.now() + data.expires_in * 1000;
    console.log('[Token] 已刷新，过期时间:', new Date(tokenCache.expiresAt).toLocaleString());
    return data.access_token;
  }

  throw new Error(`获取 Token 失败: ${data.errmsg}`);
}

/**
 * 根据传入的 appId/appSecret 获取 access_token（不使用缓存）
 * 用于前端传入凭据的场景
 */
async function getAccessTokenByApp(appId, appSecret) {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

  const { data } = await axios.get(url);

  if (data.access_token) {
    return {
      access_token: data.access_token,
      expires_in: data.expires_in
    };
  }

  throw new Error(`获取 Token 失败: ${data.errmsg}`);
}

module.exports = { getAccessToken, getAccessTokenByApp };
