const Router = require('@koa/router');
const healthService = require('../service/health');
const validate = require("../core/validation");

const ping = async (ctx) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
}
ping.validationScheme = null;

const getVersion = async (ctx) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
}
getVersion.validationScheme = null;

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installHealthRoutes(app) {
  const router = new Router({
    prefix: '/health',
  });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  app.use(router.routes()).use(router.allowedMethods());
};
