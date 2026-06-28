module.exports = {
  /**
   * 错误处理中间件
   */
  errorHandler() {
    return async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        console.error('[错误]', err.message);
        ctx.status = err.status || 500;
        ctx.body = {
          success: false,
          error: err.message || '服务器内部错误'
        };
      }
    };
  },

  /**
   * 请求日志中间件
   */
  logger() {
    return async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      console.log(`[日志] ${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
    };
  }
};
