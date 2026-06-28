const axios = require('axios');
const { getAccessToken } = require('./token');

/**
 * OAuth2.0 获取授权 URL
 */
function getOAuthUrl(redirectUri, scope = 'snsapi_userinfo', state = '') {
  const config = require('../config');
  const encodedUri = encodeURIComponent(redirectUri);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodedUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
}

/**
 * 用 code 换取用户信息
 */
async function getUserByCode(code) {
  const config = require('../config');

  // 1. code 换 token
  const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appId}&secret=${config.appSecret}&code=${code}&grant_type=authorization_code`;
  const { data: tokenData } = await axios.get(tokenUrl);

  if (tokenData.errcode) {
    throw new Error(`换取 token 失败: ${tokenData.errmsg}`);
  }

  // 2. 获取用户信息
  const userUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}&lang=zh_CN`;
  const { data: userData } = await axios.get(userUrl);

  return {
    openid: userData.openid,
    nickname: userData.nickname,
    headimgurl: userData.headimgurl,
    unionid: userData.unionid
  };
}

/**
 * 创建草稿
 * @param {Array} articles - 文章数组
 * @param {string} [token] - 可选，前端传入的 access_token
 */
async function createDraft(articles, token) {
  const accessToken = token || await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;

  const { data } = await axios.post(url, { articles });

  if (data.errcode) {
    throw new Error(`创建草稿失败: ${data.errmsg}`);
  }

  return data.media_id;
}

/**
 * 发布草稿
 * @param {string} mediaId - 草稿 media_id
 * @param {string} [token] - 可选，前端传入的 access_token
 */
async function publishDraft(mediaId, token) {
  const accessToken = token || await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=${accessToken}`;

  const { data } = await axios.post(url, { media_id: mediaId });

  if (data.errcode) {
    throw new Error(`发布失败: ${data.errmsg}`);
  }

  return data.publish_id;
}

module.exports = {
  getOAuthUrl,
  getUserByCode,
  createDraft,
  publishDraft
};
