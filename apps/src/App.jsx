import React, { useState, useRef } from 'react';
import { getAccessToken, uploadImage, createDraft, publishDraft } from './api';
import HotNews from './components/HotNews';
import MaterialPicker from './components/MaterialPicker';

const STEPS = [
  { key: 1, label: '获取 Token', icon: '🔑' },
  { key: 2, label: '上传封面', icon: '🖼️' },
  { key: 3, label: '创建草稿', icon: '📝' },
  { key: 4, label: '发布文章', icon: '🚀' },
];

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 各步骤完成状态
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [step4Done, setStep4Done] = useState(false);

  // Token 相关
  const [appId, setAppId] = useState('wx0814578de59be1fa');
  const [appSecret, setAppSecret] = useState('14df2a5214c3d560fc53367fb07d449d');
  const [accessToken, setAccessToken] = useState('');
  const [tokenExpiresIn, setTokenExpiresIn] = useState(0);

  // 表单数据
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // 结果
  const [thumbMediaId, setThumbMediaId] = useState('');
  const [draftMediaId, setDraftMediaId] = useState('');
  const [publishId, setPublishId] = useState('');

  // 消息提示
  const [successMsg, setSuccessMsg] = useState('');

  // 素材选择器
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const contentRef = useRef(null);

  function getCompletedCount() {
    return [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;
  }

  function canGoToStep(n) {
    if (n === 1) return true;
    if (n === 2) return step1Done;
    if (n === 3) return step1Done && step2Done;
    if (n === 4) return step1Done && step2Done && step3Done;
    return false;
  }

  function goToStep(n) {
    if (canGoToStep(n)) {
      setActiveStep(n);
      setError(null);
      setSuccessMsg('');
    }
  }

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
        setStep1Done(true);
        setSuccessMsg('Token 获取成功，有效期 ' + res.expires_in + ' 秒');
        setActiveStep(2);
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
        setStep2Done(true);
        setSuccessMsg('封面图上传成功');
        setActiveStep(3);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function handleSkipUpload() {
    setStep2Done(true);
    setActiveStep(3);
    setSuccessMsg('已跳过封面图上传');
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
      const articles = [{ title, content }];
      if (thumbMediaId) {
        articles[0].thumb_media_id = thumbMediaId;
      }
      const res = await createDraft(articles, accessToken);
      if (res.success) {
        setDraftMediaId(res.media_id);
        setStep3Done(true);
        setSuccessMsg('草稿创建成功');
        setActiveStep(4);
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
        setPublishId(res.publish_id);
        setStep4Done(true);
        setSuccessMsg('发布成功! publish_id: ' + res.publish_id);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function reset() {
    setActiveStep(1);
    setAppId('');
    setAppSecret('');
    setAccessToken('');
    setTokenExpiresIn(0);
    setTitle('');
    setContent('');
    setFile(null);
    setFileName('');
    setThumbMediaId('');
    setDraftMediaId('');
    setPublishId('');
    setStep1Done(false);
    setStep2Done(false);
    setStep3Done(false);
    setStep4Done(false);
    setError(null);
    setSuccessMsg('');
  }

  function maskToken(token) {
    if (!token || token.length < 10) return token;
    return token.slice(0, 6) + '...' + token.slice(-4);
  }

  // AI 生成文章后的回调
  function handleArticleGenerated(aiTitle, aiContent) {
    setTitle(aiTitle);
    // AI 返回的可能是 HTML，直接用
    setContent(aiContent);
    setStep2Done(true);
    setActiveStep(3);
    setSuccessMsg('AI 已生成文章，请检查并修改后提交');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 插入 HTML 片段到内容
  function insertHtml(html) {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    setContent(before + html + after);
    // 恢复光标位置
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + html.length;
    }, 0);
  }

  // 从素材库选择图片
  function handlePickMaterial({ url }) {
    setShowMaterialPicker(false);
    const imgHtml = `\n<img src="${url}" style="max-width:100%;border-radius:4px;margin:10px 0;" />\n`;
    insertHtml(imgHtml);
  }

  // 插入内容区上传的图片
  async function handleContentImageUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    setLoading(true);
    try {
      const res = await uploadImage(f, accessToken);
      if (res.success && res.url) {
        const imgHtml = `\n<img src="${res.url}" style="max-width:100%;border-radius:4px;margin:10px 0;" />\n`;
        insertHtml(imgHtml);
        setSuccessMsg('图片已插入');
      } else {
        setError(res.error || '上传失败');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    e.target.value = '';
  }

  // 插入广告模板
  function insertAdTemplate() {
    const adHtml = `
<section style="margin:20px 0;padding:16px;background:#f7f7f7;border-radius:8px;text-align:center;">
  <p style="font-size:12px;color:#999;margin:0;">— 广告 —</p>
  <img src="YOUR_AD_IMAGE_URL" style="max-width:100%;margin-top:8px;border-radius:4px;" />
  <p style="font-size:13px;color:#666;margin-top:8px;">长按识别二维码了解更多</p>
</section>`;
    insertHtml(adHtml);
    setSuccessMsg('已插入广告模板，请替换图片 URL');
  }

  // 插入分隔线
  function insertDivider() {
    insertHtml('\n<hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />\n');
  }

  const completedCount = getCompletedCount();

  return (
    <div className="container">
      <h1>📝 微信公众号发布</h1>

      {/* 顶部进度条 */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>
        <span className="progress-text">已完成 {completedCount}/4 步</span>
      </div>

      {/* 步骤导航 */}
      <div className="stepper">
        {STEPS.map((s, i) => {
          const isDone = [step1Done, step2Done, step3Done, step4Done][i];
          const isActive = activeStep === s.key;
          const clickable = canGoToStep(s.key);
          return (
            <React.Fragment key={s.key}>
              {i > 0 && (
                <div className={`stepper-line ${isDone ? 'done' : ''}`} />
              )}
              <div
                className={`stepper-node ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${clickable ? 'clickable' : ''}`}
                onClick={() => goToStep(s.key)}
              >
                <div className="stepper-circle">
                  {isDone && !isActive ? '✓' : s.icon}
                </div>
                <div className="stepper-label">{s.label}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 全局提示 */}
      {successMsg && <div className="result success">{successMsg}</div>}
      {error && <div className="result error">{error}</div>}

      {/* Step 1: 获取 Token */}
      <div className={`card ${activeStep === 1 ? 'card-active' : 'card-collapsed'}`}>
        <div className="card-header" onClick={() => goToStep(1)}>
          <div className="card-title">
            <span className="step-num">①</span> 获取 Access Token
            {step1Done && <span className="badge done-badge">✓ 已完成</span>}
            {!step1Done && activeStep !== 1 && <span className="badge pending-badge">待完成</span>}
          </div>
          {step1Done && activeStep !== 1 && (
            <div className="card-summary">Token: {maskToken(accessToken)} · 有效期 {tokenExpiresIn}s</div>
          )}
        </div>
        {activeStep === 1 && (
          <div className="card-body">
            <p style={{ marginBottom: 15, color: '#666', fontSize: 13 }}>
              输入公众号的 AppID 和 AppSecret 来获取 access_token
            </p>
            <div className="form-group">
              <label>AppID</label>
              <input value={appId} onChange={e => setAppId(e.target.value)} placeholder="请输入 AppID" />
            </div>
            <div className="form-group">
              <label>AppSecret</label>
              <input type="password" value={appSecret} onChange={e => setAppSecret(e.target.value)} placeholder="请输入 AppSecret" />
            </div>
            <button onClick={handleGetToken} disabled={loading}>
              {loading ? '获取中...' : '获取 Token'}
            </button>
          </div>
        )}
      </div>

      {/* Step 2: 上传封面 */}
      <div className={`card ${activeStep === 2 ? 'card-active' : 'card-collapsed'} ${!canGoToStep(2) ? 'card-disabled' : ''}`}>
        <div className="card-header" onClick={() => goToStep(2)}>
          <div className="card-title">
            <span className="step-num">②</span> 上传封面图（可选）
            {step2Done && <span className="badge done-badge">✓ 已完成</span>}
            {!step2Done && activeStep !== 2 && canGoToStep(2) && <span className="badge pending-badge">待完成</span>}
          </div>
          {step2Done && activeStep !== 2 && (
            <div className="card-summary">{thumbMediaId ? '已上传封面图' : '已跳过'}</div>
          )}
        </div>
        {activeStep === 2 && (
          <div className="card-body">
            <div className="form-group">
              <label>选择图片</label>
              <div className="file-input-wrap">
                <label className="file-input-btn">
                  {fileName || '选择封面图'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files[0];
                      if (f) {
                        setFile(f);
                        setFileName(f.name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleUpload} disabled={loading || !file}>
                {loading ? '上传中...' : '上传封面图'}
              </button>
              <button className="secondary" onClick={handleSkipUpload}>
                跳过此步
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: 创建草稿 */}
      <div className={`card ${activeStep === 3 ? 'card-active' : 'card-collapsed'} ${!canGoToStep(3) ? 'card-disabled' : ''}`}>
        <div className="card-header" onClick={() => goToStep(3)}>
          <div className="card-title">
            <span className="step-num">③</span> 创建草稿
            {step3Done && <span className="badge done-badge">✓ 已完成</span>}
            {!step3Done && activeStep !== 3 && canGoToStep(3) && <span className="badge pending-badge">待完成</span>}
          </div>
          {step3Done && activeStep !== 3 && (
            <div className="card-summary">标题: {title}</div>
          )}
        </div>
        {activeStep === 3 && (
          <div className="card-body">
            <div className="form-group">
              <label>文章标题</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="请输入标题" />
            </div>

            <div className="form-group">
              <label>文章内容（支持 HTML）</label>

              {/* 工具栏 */}
              <div className="editor-toolbar">
                <button className="toolbar-btn" onClick={() => insertHtml('<strong>加粗文字</strong>')} title="加粗">B</button>
                <button className="toolbar-btn" onClick={() => insertHtml('<em>斜体文字</em>')} title="斜体"><em>I</em></button>
                <div className="toolbar-divider" />
                <label className="toolbar-btn" title="上传图片到内容">
                  🖼️
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleContentImageUpload} />
                </label>
                <button className="toolbar-btn" onClick={() => setShowMaterialPicker(true)} title="从素材库选择">📦</button>
                <div className="toolbar-divider" />
                <button className="toolbar-btn" onClick={insertDivider} title="分隔线">—</button>
                <button className="toolbar-btn" onClick={insertAdTemplate} title="插入广告模板">📢</button>
              </div>

              {/* 编辑区 */}
              <textarea
                ref={contentRef}
                className="html-editor"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="输入 HTML 内容，例如：
<p style='font-size:16px;color:#333;'>正文内容</p>
<img src='图片URL' />
<section style='background:#f7f7f7;padding:16px;'>广告区域</section>"
              />
            </div>

            {/* 实时预览 */}
            <div className="form-group">
              <label>实时预览</label>
              <div className="preview-frame">
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <div style={{ color: '#ccc', textAlign: 'center', padding: 40 }}>输入内容后在此预览</div>
                )}
              </div>
            </div>

            <button onClick={handleCreateDraft} disabled={loading}>
              {loading ? '创建中...' : '创建草稿'}
            </button>
          </div>
        )}
      </div>

      {/* Step 4: 发布 */}
      <div className={`card ${activeStep === 4 ? 'card-active' : 'card-collapsed'} ${!canGoToStep(4) ? 'card-disabled' : ''}`}>
        <div className="card-header" onClick={() => goToStep(4)}>
          <div className="card-title">
            <span className="step-num">④</span> 发布文章
            {step4Done && <span className="badge done-badge">✓ 已完成</span>}
            {!step4Done && activeStep !== 4 && canGoToStep(4) && <span className="badge pending-badge">待完成</span>}
          </div>
          {step4Done && activeStep !== 4 && (
            <div className="card-summary">已发布 · publish_id: {publishId}</div>
          )}
        </div>
        {activeStep === 4 && (
          <div className="card-body">
            {step4Done ? (
              <div>
                <div className="result success">✅ 发布成功! publish_id: {publishId}</div>
                <button onClick={reset} style={{ marginTop: 15 }}>再写一篇</button>
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: 15, color: '#666', fontSize: 13 }}>
                  草稿已创建，media_id: <code>{draftMediaId}</code>
                </p>
                <button onClick={handlePublish} disabled={loading}>
                  {loading ? '发布中...' : '🚀 立即发布'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 素材选择器弹窗 */}
      {showMaterialPicker && (
        <MaterialPicker
          token={accessToken}
          onPick={handlePickMaterial}
          onClose={() => setShowMaterialPicker(false)}
        />
      )}

      {/* 热点新闻区域 */}
      <HotNews onArticleGenerated={handleArticleGenerated} />
    </div>
  );
}
