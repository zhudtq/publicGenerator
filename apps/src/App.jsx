import React, { useState } from 'react';
import { getAccessToken, uploadImage, createDraft, publishDraft } from './api';
import HotNews from './components/HotNews';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Token 相关
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [tokenExpiresIn, setTokenExpiresIn] = useState(0);

  // 表单数据
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // 结果
  const [thumbMediaId, setThumbMediaId] = useState('');
  const [draftMediaId, setDraftMediaId] = useState('');

  // ① 获取 Token
  async function handleGetToken() {
    if (!appId || !appSecret) {
      setError('请填写 AppID 和 AppSecret');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getAccessToken(appId, appSecret);
      if (res.success) {
        setAccessToken(res.access_token);
        setTokenExpiresIn(res.expires_in);
        setResult('Token 获取成功，有效期 ' + res.expires_in + ' 秒');
        setStep(2);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // ② 上传封面图
  async function handleUpload() {
    if (!file) {
      setError('请选择封面图');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await uploadImage(file, accessToken);
      if (res.success) {
        setThumbMediaId(res.media_id);
        setResult('封面图上传成功: ' + res.media_id);
        setStep(3);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // ③ 创建草稿
  async function handleCreateDraft() {
    if (!title || !content) {
      setError('请填写标题和内容');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      var articles = [{
        title: title,
        content: '<p>' + content + '</p>'
      }];
      if (thumbMediaId) {
        articles[0].thumb_media_id = thumbMediaId;
      }
      const res = await createDraft(articles, accessToken);
      if (res.success) {
        setDraftMediaId(res.media_id);
        setResult('草稿创建成功: ' + res.media_id);
        setStep(4);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // ④ 发布
  async function handlePublish() {
    setLoading(true);
    setError(null);
    try {
      const res = await publishDraft(draftMediaId, accessToken);
      if (res.success) {
        setResult('发布成功! publish_id: ' + res.publish_id);
        setStep(5);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function reset() {
    setStep(1);
    setAppId('');
    setAppSecret('');
    setAccessToken('');
    setTokenExpiresIn(0);
    setTitle('');
    setContent('');
    setFile(null);
    setThumbMediaId('');
    setDraftMediaId('');
    setResult(null);
    setError(null);
  }

  // 脱敏显示 token
  function maskToken(token) {
    if (!token || token.length < 10) return token;
    return token.slice(0, 6) + '...' + token.slice(-4);
  }

  // AI 生成文章后的回调
  function handleArticleGenerated(aiTitle, aiContent) {
    setTitle(aiTitle);
    setContent(aiContent.replace(/<[^>]+>/g, '')); // 去除 HTML 标签填入 textarea
    setStep(3); // 跳转到创建草稿步骤
    setResult('AI 已生成文章，请检查并修改后提交');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="container">
      <h1>📝 微信公众号发布</h1>

      {/* 步骤指示器 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {['获取Token', '上传封面', '创建草稿', '发布文章'].map((label, i) => (
          <div key={i} className="step" style={{
            borderColor: step > i + 1 ? '#07c160' : '#ddd',
            color: step > i + 1 ? '#07c160' : '#999'
          }}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* Step 1: 获取 Token */}
      {step === 1 && (
        <div className="card">
          <h2>① 获取 Access Token</h2>
          <p style={{ marginBottom: 15, color: '#666', fontSize: 13 }}>
            输入公众号的 AppID 和 AppSecret 来获取 access_token
          </p>
          <div className="form-group">
            <label>AppID</label>
            <input
              value={appId}
              onChange={e => setAppId(e.target.value)}
              placeholder="请输入 AppID"
            />
          </div>
          <div className="form-group">
            <label>AppSecret</label>
            <input
              type="password"
              value={appSecret}
              onChange={e => setAppSecret(e.target.value)}
              placeholder="请输入 AppSecret"
            />
          </div>
          <button onClick={handleGetToken} disabled={loading}>
            {loading ? '获取中...' : '获取 Token'}
          </button>
        </div>
      )}

      {/* Token 已获取后的提示栏 */}
      {step >= 2 && accessToken && (
        <div className="token-bar">
          <span>🔑 Token: {maskToken(accessToken)}</span>
          <span style={{ marginLeft: 10, color: '#999', fontSize: 12 }}>
            有效期 {tokenExpiresIn}s
          </span>
        </div>
      )}

      {/* Step 2: 上传封面图 */}
      {step === 2 && (
        <div className="card">
          <h2>② 上传封面图（可选）</h2>
          <div className="form-group">
            <label>选择图片</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          </div>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? '上传中...' : '上传'}
          </button>
          <button className="secondary" onClick={() => setStep(3)}>
            跳过
          </button>
        </div>
      )}

      {/* Step 3: 创建草稿 */}
      {step === 3 && (
        <div className="card">
          <h2>③ 创建草稿</h2>
          <div className="form-group">
            <label>文章标题</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="请输入标题" />
          </div>
          <div className="form-group">
            <label>文章内容</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="请输入正文内容" />
          </div>
          <button onClick={handleCreateDraft} disabled={loading}>
            {loading ? '创建中...' : '创建草稿'}
          </button>
        </div>
      )}

      {/* Step 4: 发布 */}
      {step === 4 && (
        <div className="card">
          <h2>④ 发布文章</h2>
          <p style={{ marginBottom: 15 }}>草稿已创建，media_id: {draftMediaId}</p>
          <button onClick={handlePublish} disabled={loading}>
            {loading ? '发布中...' : '立即发布'}
          </button>
          <button className="secondary" onClick={reset}>
            再写一篇
          </button>
        </div>
      )}

      {/* Step 5: 完成 */}
      {step === 5 && (
        <div className="card">
          <h2>✅ 发布完成</h2>
          <div className="result success">{result}</div>
          <button onClick={reset} style={{ marginTop: 15 }}>再写一篇</button>
        </div>
      )}

      {/* 结果/错误显示 */}
      {result && step < 5 && <div className="result success">{result}</div>}
      {error && <div className="result error">{error}</div>}

      {/* 热点新闻区域 */}
      <HotNews onArticleGenerated={handleArticleGenerated} />
    </div>
  );
}
