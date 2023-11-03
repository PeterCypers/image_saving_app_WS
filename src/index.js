const config = require('config');
const Koa = require('koa');
// const winston = require('winston'); verplaatst naar core
const bodyParser = require('koa-bodyparser'); // middleware
const installRest = require('./rest/index'); // of ./rest -> gaat automatisch naar index
const { initializeLogger, getLogger } = require('./core/logging');
const koaCors = require('@koa/cors');
const { initializeData } = require('./data');

const NODE_ENV = config.get('env') // process.env.NODE_ENV;
const LOG_LEVEL = config.get("logging.level");
const LOG_DISABLED = config.get("logging.disabled");
const CORS_ORIGINS = config.get('cors.origins'); //@koa/cors
const CORS_MAX_AGE = config.get('cors.maxAge'); //@koa/cors
const dbclient = config.get('database.client');
console.log('db client ' + dbclient);

async function main() {
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: { NODE_ENV },
  });

  await initializeData();

  getLogger().info(`log level ${LOG_LEVEL}, disabled ${LOG_DISABLED} in env ${NODE_ENV}`); //TODO: overbodig?

  // Koa gebruikt een ketting van middleware die een request verwerken en uiteindelijk de endpunt response teruggeeft
  const app = new Koa();
  // const router = new Router(); //verplaatst naar rest-laag

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

  installRest(app);

  // alle router methodes verplaatst naar rest-laag inclusief "app.use(router.routes()).use(router.allowedMethods());"
  // logger.error|info|http|warning|verbose|debug|silly
  app.listen(9000, () => {getLogger().info(`server is running at http://localhost:9000`)});
}

main();