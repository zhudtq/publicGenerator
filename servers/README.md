# 微信公众号后端服务

基于 Koa 的微信公众号后端服务。

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 APP_ID、APP_SECRET、TOKEN

# 3. 启动服务
npm run dev
```

## 接口文档

### 服务器验证
```
GET /wechat/verify?signature=xxx&timestamp=xxx&nonce=xxx&echostr=xxx
```
用于微信后台配置服务器 URL 时的验证。

### OAuth 授权
```
# 1. 获取授权链接（前端跳转用）
GET /wechat/oauth/url?redirect_uri=https://xxx/callback

# 2. 授权回调（微信回调此接口）
GET /wechat/oauth/callback?code=xxx
```

### 文章发布
```
# 1. 创建草稿
POST /wechat/draft
Body: { "articles": [{ "title": "标题", "content": "HTML内容" }] }

# 2. 发布
POST /wechat/publish
Body: { "media_id": "草稿ID" }
```

## 微信后台配置

登录 [微信公众平台](https://mp.weixin.qq.com/) → 开发 → 基本配置：

- 服务器地址: `https://your-domain.com/wechat/verify`
- 令牌: 与 `.env` 中的 TOKEN 一致
- 消息加解密方式: 明文模式（开发阶段）
