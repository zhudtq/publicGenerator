import React, { useState, useEffect } from 'react';
import { fetchMaterials } from '../api';

/**
 * 素材选择器弹窗
 * 选择后回调 onPick({ media_id, url })
 */
export default function MaterialPicker({ token, onPick, onClose }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMaterials(token, 'image');
      if (res.success) {
        setMaterials(res.items || []);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📦 选择素材图片</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="result error">{error}</div>}

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>加载中...</div>
        ) : materials.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
            暂无素材，请先上传图片
          </div>
        ) : (
          <div className="material-grid">
            {materials.map((item, i) => (
              <div
                key={i}
                className="material-item"
                onClick={() => onPick({ media_id: item.media_id, url: item.url })}
              >
                <img src={item.url} alt={item.name || ''} />
                <div className="material-name">{item.name || '未命名'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
