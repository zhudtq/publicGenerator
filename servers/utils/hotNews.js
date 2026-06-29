const axios = require('axios');

/**
 * 获取百度热搜榜
 * 返回格式化的热点列表
 */
async function fetchHotNews() {
  const url = 'https://top.baidu.com/api/board?platform=wise&tab=realtime';

  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    timeout: 10000
  });

  if (!data || !data.data || !data.data.cards) {
    throw new Error('获取热搜数据失败');
  }

  // 解析热搜卡片
  const cards = data.data.cards;
  const newsList = [];

  for (const card of cards) {
    if (!card.content) continue;
    for (const item of card.content) {
      newsList.push({
        title: item.word || item.query || '',
        desc: item.desc || '',
        hotScore: parseInt(item.hotScore || item.index || 0, 10),
        url: item.url || item.rawUrl || '',
        img: item.img || ''
      });
    }
  }

  // 按热度排序，取前 30
  newsList.sort((a, b) => b.hotScore - a.hotScore);
  return newsList.slice(0, 30);
}

module.exports = { fetchHotNews };
