const config = require('config');
const Koa = require('koa');
const installRest = require('./rest/index'); // of ./rest -> gaat automatisch naar index
const { initializeLogger, getLogger } = require('./core/logging');
const { initializeData, shutdownData } = require('./data');
const installMiddleware = require('./core/installMiddlewares');

const NODE_ENV = config.get('env') // process.env.NODE_ENV;
const LOG_LEVEL = config.get("logging.level");
const LOG_DISABLED = config.get("logging.disabled");

// creeren van een server die niet luistert voor de testing
module.exports = async function createServer() {
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

  //nieuw bijgekomen: afgezonderd in een aparte file
  installMiddleware(app);

  installRest(app);

  return {
    getApp() {
        return app;
    },
    start() {
        return new Promise((resolve) => {
            app.listen(9000, () => {getLogger().info(`server is running at http://localhost:9000`)});
            resolve();
        })
    },
    async stop(){
        app.removeAllListeners();
        await shutdownData();
        getLogger().info('Goodbye! 👋');
    }
  }

}
