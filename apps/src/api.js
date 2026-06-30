// API 请求封装
const BASE_URL = '/wechat';

export async function getOAuthUrl(redirectUri) {
  const res = await fetch(`${BASE_URL}/oauth/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
  return res.json();
}

/**
 * 根据 AppID/AppSecret 获取 access_token
 */
export async function getAccessToken(appId, appSecret) {
  const res = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  });
  return res.json();
}

/**
 * 构造带 Authorization header 的请求头
 */
function authHeaders(token, extra = {}) {
  const headers = { ...extra };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append('media', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData
  });
  return res.json();
}

export async function createDraft(articles, token) {
  const res = await fetch(`${BASE_URL}/draft`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ articles })
  });
  return res.json();
}

export async function publishDraft(mediaId, token) {
  const res = await fetch(`${BASE_URL}/publish`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ media_id: mediaId })
  });
  return res.json();
}

/**
 * 获取素材列表
 */
export async function fetchMaterials(token, type = 'image', page = 1) {
  const res = await fetch(`${BASE_URL}/materials?type=${type}&page=${page}`, {
    headers: authHeaders(token)
  });
  return res.json();
}

/**
 * 获取当日热点新闻
 */
export async function fetchHotNews() {
  const res = await fetch(`${BASE_URL}/hot-news`);
  return res.json();
}

/**
 * AI 根据热点生成文章
 */
export async function generateArticle(title, description) {
  const res = await fetch(`${BASE_URL}/ai/generate-article`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  return res.json();
}
