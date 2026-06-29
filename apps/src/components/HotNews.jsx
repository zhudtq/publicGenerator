import React, { useState, useEffect } from 'react';
import { fetchHotNews, generateArticle } from '../api';

export default function HotNews({ onArticleGenerated }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  useEffect(() => {
    loadHotNews();
  }, []);

  async function loadHotNews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHotNews();
      if (res.success) {
        setNews(res.data);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleGenerateArticle(item, index) {
    setGeneratingIndex(index);
    try {
      const res = await generateArticle(item.title, item.desc);
      if (res.success && onArticleGenerated) {
        onArticleGenerated(res.data.title, res.data.content);
      } else if (!res.success) {
        alert('生成失败: ' + res.error);
      }
    } catch (e) {
      alert('生成失败: ' + e.message);
    }
    setGeneratingIndex(-1);
  }

  function formatHotScore(score) {
    if (score >= 10000) {
      return (score / 10000).toFixed(1) + '万';
    }
    return score.toString();
  }

  return (
    <div className="hot-news-section">
      <div className="hot-news-header">
        <h2>🔥 今日热点</h2>
        <button className="secondary" onClick={loadHotNews} disabled={loading}>
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {error && <div className="result error">{error}</div>}

      {loading && news.length === 0 && (
        <div className="hot-news-loading">加载中...</div>
      )}

      <div className="hot-news-grid">
        {news.map((item, i) => (
          <div key={i} className="hot-news-card">
            <div className="hot-news-rank">{i + 1}</div>
            <div className="hot-news-body">
              <div className="hot-news-title">{item.title}</div>
              {item.desc && <div className="hot-news-desc">{item.desc}</div>}
              <div className="hot-news-meta">
                <span className="hot-score">🔥 {formatHotScore(item.hotScore)}</span>
                <button
                  className="ai-btn"
                  onClick={() => handleGenerateArticle(item, i)}
                  disabled={generatingIndex >= 0}
                >
                  {generatingIndex === i ? '生成中...' : '✨ AI 写文章'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
