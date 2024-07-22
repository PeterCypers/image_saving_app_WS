const Router = require('@koa/router');
const installHealthRouter = require('./health');
const installFotoRouter = require('./foto');
const installAlbumRouter = require('./album');

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
  installFotoRouter(router);
  installAlbumRouter(router);
  // ... possible aditional routes

  app.use(router.routes())
     .use(router.allowedMethods());
};
