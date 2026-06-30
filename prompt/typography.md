---
name: wechat-typography
description: 将文案和图片转换为微信公众号兼容的 HTML 富文本格式，支持自定义排版模板、素材图片插入、广告位等。
---

# 微信公众号排版 Skill

将用户提供的文案（纯文本 / Markdown / 粗略 HTML）转换为微信公众号编辑器兼容的 HTML 富文本。输出可直接用于创建草稿。

## 输入格式

用户可能提供以下任意一种：
- **纯文本**：直接粘贴的一段文字，可能有简单的换行和空行
- **Markdown**：带 `#` 标题、`**加粗**`、`> 引用`、`- 列表` 等标记
- **粗略 HTML**：已有部分标签但样式不规范的 HTML

额外信息（可选）：
- 素材图片 URL 列表（如广告图、头图，来自微信素材库，域名为 `mmbiz.qpic.cn`）
- 排版风格偏好（简约 / 杂志风 / 科技感等）
- 是否需要头部/尾部模板

## 输出格式

一段完整的 HTML，可直接传入微信草稿 API 的 `content` 字段。

## 微信 HTML 规则（必须遵守）

### 允许的标签

```
<section> <p> <span> <div>
<h1> <h2> <h3> <h4> <h5> <h6>
<strong> <b> <em> <i> <u> <s>
<br> <hr>
<img>
<a>
<table> <tr> <td> <th> <thead> <tbody>
<ul> <ol> <li>
<blockquote>
<sup> <sub>
<pre> <code>
```

### 禁止的内容

- `<style>` 标签 — 必须用 inline style
- `<script>` 标签
- `class` / `id` 选择器 — 只用 `style` 属性
- 外链 CSS 文件
- `position: fixed / absolute`（部分场景被过滤）
- `animation` / `transition`
- 非白名单标签（如 `<iframe>`、`<video>`、`<audio>`）

### 图片规则

- 图片必须托管在微信 CDN（`mmbiz.qpic.cn`）上
- 外链图片会被微信屏蔽，不显示
- 使用 `<img src="微信素材URL" style="max-width:100%;" />`
- 用户如提供素材 URL，直接使用；如未提供，用占位符 `{{IMAGE_1}}` 标记

## 排版规范

### 默认样式

| 元素 | 样式 |
|------|------|
| 正文段落 `<p>` | `font-size:15px; color:#3f3f3f; line-height:1.8; margin:0 0 16px 0;` |
| 一级标题 `<h2>` | `font-size:20px; color:#1a1a1a; font-weight:bold; margin:24px 0 12px 0;` |
| 二级标题 `<h3>` | `font-size:17px; color:#07c160; font-weight:bold; margin:20px 0 10px 0;` |
| 加粗 `<strong>` | `font-weight:bold; color:#1a1a1a;` |
| 引用 `<blockquote>` | `border-left:3px solid #07c160; padding:10px 15px; margin:16px 0; background:#f8f8f8; color:#666; font-size:14px;` |
| 列表 `<ul>/<ol>` | `padding-left:20px; margin:12px 0; line-height:1.8;` |
| 代码 `<code>` | `background:#f5f5f5; padding:2px 6px; border-radius:3px; font-size:13px; color:#e74c3c;` |
| 分隔线 `<hr>` | `border:none; border-top:1px solid #eee; margin:24px 0;` |
| 图片 `<img>` | `max-width:100%; border-radius:4px; margin:12px 0;` |

### 段落处理

- 连续空行合并为一个 `<p>` 间距
- 首行不缩进（公众号排版惯例）
- 段落之间用 `margin-bottom: 16px` 分隔
- 单独成段的短句（如金句）可用 `<p style="text-align:center; font-size:16px; color:#07c160; font-weight:bold;">` 强调

### 图片插入

- 文案中如有 `[图片: 描述]` 标记，替换为 `<img>` 标签
- 如用户提供了素材 URL 列表，按出现顺序依次使用
- 图片默认居中：`<p style="text-align:center;"><img src="..." style="max-width:100%;border-radius:4px;" /></p>`

## 模板结构

如用户要求完整文章模板，使用以下结构：

```
┌─────────────────────────────┐
│  头部 (header)               │
│  标题 + 作者/日期 + 分隔线    │
├─────────────────────────────┤
│  正文 (body)                 │
│  排版后的文章内容             │
├─────────────────────────────┤
│  尾部 (footer)               │
│  广告图 + 关注引导 + 二维码   │
└─────────────────────────────┘
```

### 头部模板

```html
<section style="margin-bottom:20px;">
  <h1 style="font-size:22px; color:#1a1a1a; font-weight:bold; line-height:1.4; margin:0 0 12px 0;">
    {{TITLE}}
  </h1>
  <p style="font-size:13px; color:#999; margin:0;">
    {{AUTHOR}} · {{DATE}}
  </p>
  <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
</section>
```

### 尾部模板（广告 + 关注引导）

```html
<section style="margin-top:24px;">
  <hr style="border:none; border-top:1px solid #eee; margin:0 0 16px 0;" />

  <!-- 广告位 -->
  <section style="background:#f7f7f7; border-radius:8px; padding:16px; text-align:center; margin-bottom:16px;">
    <p style="font-size:12px; color:#999; margin:0 0 8px 0;">— 推荐 —</p>
    <img src="{{AD_IMAGE_URL}}" style="max-width:100%; border-radius:4px;" />
    <p style="font-size:13px; color:#666; margin:8px 0 0 0;">{{AD_TEXT}}</p>
  </section>

  <!-- 关注引导 -->
  <section style="text-align:center; padding:12px 0;">
    <p style="font-size:14px; color:#07c160; font-weight:bold; margin:0 0 4px 0;">
      👆 长按关注，获取更多精彩内容
    </p>
    <p style="font-size:12px; color:#999; margin:0;">
      觉得有用？点个「在看」分享给朋友 ❤️
    </p>
  </section>
</section>
```

## 转换流程

1. **解析输入**：识别文案格式（纯文本 / Markdown / HTML）
2. **结构化**：拆分为标题、段落、列表、引用、图片标记等块
3. **应用样式**：为每个块添加 inline style
4. **插入图片**：处理 `[图片]` 标记或用户提供的素材 URL
5. **套用模板**：如用户要求，添加头部和尾部
6. **输出 HTML**：返回可直接用于微信草稿 API 的 HTML 字符串

## 示例

### 输入（纯文本）

```
AI 正在改变内容创作的方式。

过去，写一篇公众号文章需要半天。现在，AI 可以在几分钟内生成初稿。

但这并不意味着编辑可以被取代。AI 是工具，人才是灵魂。

[图片: AI写作示意图]

你学会了吗？
```

### 输出（HTML）

```html
<p style="font-size:15px; color:#3f3f3f; line-height:1.8; margin:0 0 16px 0;">
  AI 正在改变内容创作的方式。
</p>
<p style="font-size:15px; color:#3f3f3f; line-height:1.8; margin:0 0 16px 0;">
  过去，写一篇公众号文章需要半天。现在，AI 可以在几分钟内生成初稿。
</p>
<p style="font-size:15px; color:#3f3f3f; line-height:1.8; margin:0 0 16px 0;">
  但这并不意味着编辑可以被取代。<strong style="font-weight:bold; color:#1a1a1a;">AI 是工具，人才是灵魂。</strong>
</p>
<p style="text-align:center; margin:16px 0;">
  <img src="{{IMAGE_1}}" style="max-width:100%; border-radius:4px;" />
</p>
<p style="text-align:center; font-size:16px; color:#07c160; font-weight:bold; margin:20px 0 0 0;">
  你学会了吗？
</p>
```

## 主题库

以下主题均为 inline style，可直接用于微信公众号草稿 API。选择一个主题后，所有元素的样式统一替换。

### 主题 1：经典绿（默认）

克制、专业，适合技术/资讯类公众号。

```css
主色调: #07c160 (微信绿)
强调色: #1a1a1a (近黑)
辅助色: #999 (灰)
背景色: #f8f8f8 (浅灰)
正文字号: 15px | 行高: 1.8 | 字色: #3f3f3f
```

```html
<!-- 标题 -->
<h2 style="font-size:20px; color:#1a1a1a; font-weight:bold; margin:24px 0 12px 0; padding-left:12px; border-left:4px solid #07c160;">
  标题文字
</h2>
<!-- 引用 -->
<blockquote style="margin:16px 0; padding:12px 16px; border-left:3px solid #07c160; background:#f8f8f8; color:#666; font-size:14px; line-height:1.6;">
  引用内容
</blockquote>
```

### 主题 2：杂志黑金

高端、杂志感，适合品牌/商业类公众号。

```css
主色调: #1a1a1a (纯黑)
强调色: #c9a96e (金色)
辅助色: #888 (中灰)
背景色: #fafafa
正文字号: 15px | 行高: 2.0 | 字色: #333
```

```html
<!-- 标题 -->
<h2 style="font-size:20px; color:#1a1a1a; font-weight:bold; letter-spacing:2px; margin:28px 0 16px 0; padding-bottom:12px; border-bottom:2px solid #1a1a1a;">
  标题文字
</h2>
<!-- 引用 -->
<blockquote style="margin:20px 0; padding:16px 20px; border-left:3px solid #c9a96e; background:#fafafa; color:#555; font-size:14px; font-style:italic; line-height:1.8;">
  引用内容
</blockquote>
<!-- 金句 -->
<p style="text-align:center; font-size:18px; color:#c9a96e; font-weight:bold; letter-spacing:1px; margin:24px 0; padding:20px; border-top:1px solid #eee; border-bottom:1px solid #eee;">
  金句内容
</p>
```

### 主题 3：科技蓝

冷色调，适合科技/产品类公众号。

```css
主色调: #2b6cb0 (深蓝)
强调色: #3182ce (亮蓝)
辅助色: #718096 (蓝灰)
背景色: #f7fafc (冷白)
正文字号: 15px | 行高: 1.8 | 字色: #2d3748
```

```html
<!-- 标题 -->
<h2 style="font-size:19px; color:#2b6cb0; font-weight:bold; margin:24px 0 12px 0; display:flex; align-items:center;">
  <span style="display:inline-block; width:4px; height:18px; background:#3182ce; margin-right:10px; border-radius:2px;"></span>
  标题文字
</h2>
<!-- 引用 -->
<blockquote style="margin:16px 0; padding:14px 18px; border-left:3px solid #3182ce; background:#ebf8ff; color:#4a5568; font-size:14px; line-height:1.7; border-radius:0 4px 4px 0;">
  引用内容
</blockquote>
<!-- 提示框 -->
<section style="margin:16px 0; padding:14px 18px; background:#ebf8ff; border-radius:6px; border:1px solid #bee3f8;">
  <p style="font-size:14px; color:#2b6cb0; margin:0; line-height:1.6;">
    💡 提示内容
  </p>
</section>
```

### 主题 4：极简无印

极简、留白多，适合生活/美学类公众号。

```css
主色调: #333 (深灰)
强调色: #e74c3c (点缀红)
辅助色: #999
背景色: #fff (纯白)
正文字号: 16px | 行高: 2.0 | 字色: #444
```

```html
<!-- 标题 -->
<h2 style="font-size:18px; color:#333; font-weight:bold; margin:32px 0 16px 0; letter-spacing:1px;">
  标题文字
</h2>
<!-- 引用 -->
<blockquote style="margin:20px 0; padding:0 0 0 16px; border-left:2px solid #ddd; color:#888; font-size:15px; line-height:2.0;">
  引用内容
</blockquote>
<!-- 分隔线 -->
<hr style="border:none; border-top:1px solid #eee; margin:32px 0; width:60%;" />
```

### 主题 5：暖阳橘

温暖、亲切，适合生活/情感类公众号。

```css
主色调: #e67e22 (暖橘)
强调色: #d35400 (深橘)
辅助色: #999
背景色: #fffbf5 (暖白)
正文字号: 15px | 行高: 1.9 | 字色: #3f3f3f
```

```html
<!-- 标题 -->
<h2 style="font-size:19px; color:#e67e22; font-weight:bold; margin:24px 0 12px 0; padding:8px 0; border-bottom:1px solid #f5d5a8;">
  标题文字
</h2>
<!-- 引用 -->
<blockquote style="margin:16px 0; padding:14px 18px; border-left:3px solid #e67e22; background:#fff9f0; color:#666; font-size:14px; line-height:1.7; border-radius:0 6px 6px 0;">
  引用内容
</blockquote>
<!-- 重点卡片 -->
<section style="margin:20px 0; padding:16px 20px; background:linear-gradient(135deg, #fff9f0, #fff); border-radius:8px; border:1px solid #f5d5a8;">
  <p style="font-size:15px; color:#d35400; font-weight:bold; margin:0 0 8px 0;">📌 重点</p>
  <p style="font-size:14px; color:#555; margin:0; line-height:1.8;">内容</p>
</section>
```

### 选择主题的建议

| 公众号类型 | 推荐主题 |
|-----------|---------|
| 技术/开发/资讯 | 经典绿 / 科技蓝 |
| 商业/品牌/营销 | 杂志黑金 |
| 生活/美学/文艺 | 极简无印 |
| 情感/育儿/日常 | 暖阳橘 |
| 通用/不确定 | 经典绿 |

## 使用方式

在代码中调用：

```javascript
// servers/utils/ai.js 中新增函数
async function formatArticle(text, options = {}) {
  const { images = [], theme = 'classic-green', withTemplate = false, title = '', author = '' } = options;

  // 主题样式映射
  const THEMES = {
    'classic-green': {
      name: '经典绿',
      accent: '#07c160', text: '#3f3f3f', heading: '#1a1a1a', quote: '#666', bg: '#f8f8f8',
      fontSize: '15px', lineHeight: '1.8'
    },
    'magazine-black-gold': {
      name: '杂志黑金',
      accent: '#c9a96e', text: '#333', heading: '#1a1a1a', quote: '#555', bg: '#fafafa',
      fontSize: '15px', lineHeight: '2.0'
    },
    'tech-blue': {
      name: '科技蓝',
      accent: '#3182ce', text: '#2d3748', heading: '#2b6cb0', quote: '#4a5568', bg: '#ebf8ff',
      fontSize: '15px', lineHeight: '1.8'
    },
    'minimal-white': {
      name: '极简无印',
      accent: '#ddd', text: '#444', heading: '#333', quote: '#888', bg: '#fff',
      fontSize: '16px', lineHeight: '2.0'
    },
    'warm-orange': {
      name: '暖阳橘',
      accent: '#e67e22', text: '#3f3f3f', heading: '#e67e22', quote: '#666', bg: '#fff9f0',
      fontSize: '15px', lineHeight: '1.9'
    }
  };

  const t = THEMES[theme] || THEMES['classic-green'];

  const prompt = `你是一位微信公众号排版专家。请将以下正文转换为微信公众号兼容的 HTML 格式。

主题：${t.name}
主题色：
- 主色调: ${t.accent}
- 正文字色: ${t.text}
- 标题字色: ${t.heading}
- 引用字色: ${t.quote}
- 背景色: ${t.bg}
- 正文字号: ${t.fontSize}
- 行高: ${t.lineHeight}

规则：
- 只使用 inline style，不用 class/id
- 不要用 <style>、<script>
- 图片用 <img src="URL" style="max-width:100%;" />
- 段落用 <p>，字号 ${t.fontSize}，颜色 ${t.text}，行高 ${t.lineHeight}
- 标题用 <h2>，颜色 ${t.heading}，左边框或下边框用主色调 ${t.accent}
- 引用用 <blockquote>，左边框 3px 主色调 ${t.accent}，背景 ${t.bg}
- 加粗用 <strong>，颜色 ${t.heading}
- [图片: 描述] 标记替换为 <img> 标签
- 金句/重点句居中显示，字号加大，用主色调
- 所有样式必须 inline

${images.length > 0 ? '可用素材图片 URL：\n' + images.map((url, i) => `[${i + 1}] ${url}`).join('\n') + '\n按顺序使用。' : ''}
${withTemplate ? `请包含头部和尾部模板。\n标题: ${title || '{{TITLE}}'}\n作者: ${author || '{{AUTHOR}}'}` : ''}

正文：
---
${text}
---

只输出 HTML，不要其他解释。`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
}
```
