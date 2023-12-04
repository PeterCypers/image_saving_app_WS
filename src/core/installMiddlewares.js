const config = require('config');
const bodyParser = require('koa-bodyparser'); // middleware
const koaCors = require('@koa/cors');

const CORS_ORIGINS = config.get('cors.origins'); //@koa/cors
const CORS_MAX_AGE = config.get('cors.maxAge'); //@koa/cors

module.exports = function installMiddleware(app) {

  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
          return ctx.request.header.origin;
        }
        // Not a valid domain at this point, let's return the first valid as we should return a string
        return CORS_ORIGINS[0];
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAX_AGE,
    })
  );

  // altijd eerst bodyParser meegeven aan de Koa app
  app.use(bodyParser());

}
