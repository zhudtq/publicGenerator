const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const config = require('./config');
const { errorHandler, logger } = require('./middleware');
const wechatRouter = require('./routes/wechat');

const app = new Koa();

// 中间件
app.use(errorHandler());
app.use(logger());
app.use(bodyParser());

// 路由
app.use(wechatRouter.routes());
app.use(wechatRouter.allowedMethods());

// 健康检查
app.use(async (ctx) => {
  if (ctx.path === '/') {
    ctx.body = {
      service: '微信公众号服务',
      status: 'running',
      time: new Date().toISOString()
    };
  }
});

// 启动服务
app.listen(config.port, () => {
  console.log('=========================================');
  console.log('  微信公众号服务已启动');
  console.log(`  地址: http://localhost:${config.port}`);
  console.log('=========================================');
  console.log('');
  console.log('接口列表:');
  console.log('  GET  /wechat/verify        - 服务器验证');
  console.log('  POST /wechat/message       - 接收消息');
  console.log('  GET  /wechat/oauth/url     - 获取授权链接');
  console.log('  GET  /wechat/oauth/callback - OAuth 回调');
  console.log('  POST /wechat/draft         - 创建草稿');
  console.log('  POST /wechat/publish       - 发布文章');
  console.log('');
});
