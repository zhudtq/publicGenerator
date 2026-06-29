const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');

const client = new Anthropic({ apiKey: config.anthropicApiKey });

/**
 * 根据热点话题生成公众号文章
 * @param {string} title - 热点标题
 * @param {string} description - 热点描述
 * @returns {{ title: string, content: string }}
 */
async function generateArticle(title, description) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `你是一位专业的微信公众号编辑。请根据以下热点新闻，撰写一篇公众号文章。

热点标题：${title}
热点描述：${description}

要求：
1. 标题要吸引人，适合公众号传播，15-30字以内
2. 正文 500-800 字，结构清晰，有引言、正文、总结
3. 语言风格：专业但不枯燥，适合大众阅读
4. 正文用 HTML 格式，使用 <p>、<h3>、<blockquote> 等标签
5. 不要使用 markdown，直接输出 HTML

请严格按照以下 JSON 格式返回，不要输出其他内容：
{"title": "文章标题", "content": "HTML正文内容"}`
    }]
  });

  const text = response.content[0].text.trim();

  // 尝试解析 JSON
  try {
    // 处理可能被 markdown 包裹的情况
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(jsonStr);
    return {
      title: result.title || title,
      content: result.content || ''
    };
  } catch (e) {
    throw new Error('AI 返回格式解析失败: ' + text.slice(0, 200));
  }
}

module.exports = { generateArticle };
