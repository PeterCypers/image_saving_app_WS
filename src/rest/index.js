const Router = require('@koa/router');
const installTransactionRouter = require('./transaction');
const installHealthRouter = require('./health');
const installPlaceRouter = require('./place');
//TODO: gebruik routers naar eigen tables
/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installHealthRouter(router);
  installTransactionRouter(router);
  installPlaceRouter(router);

  app.use(router.routes())
     .use(router.allowedMethods());
};
