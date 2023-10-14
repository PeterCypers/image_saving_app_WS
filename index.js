const Koa = require('koa');
const winston = require('winston');
const config = require('config');

const LOG_LEVEL = config.get("logging.level");
const LOG_DISABLED = config.get("logging.disabled");
const NODE_ENV = config.get('env') // process.env.NODE_ENV;

// format: format.json() or format.simple()
// {silent:LOG_DISABLED} -> er gebeurt logging
const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.simple(),
    defaultMeta: { service: '2324-webservices-PeterCypers' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
    //   new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //   new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({silent:LOG_DISABLED}),
    ],
  });

logger.info(`log level ${LOG_LEVEL}, disabled ${LOG_DISABLED} in env ${NODE_ENV}`);

// Koa gebruikt een ketting van middleware die een request verwerken en uiteindelijk de endpunt response teruggeeft
const app = new Koa();

// volgorde is belangrijk, krijgt context en next mee
app.use(async(ctx, next) => {
    ctx.body = "Hello World!!";
    return next();
})

app.use(async(ctx, next) => {
    console.log(ctx);
})

// logger.error|info|http|warning|verbose|debug|silly
app.listen(9000, () => {logger.info(`server is running at http:\\localhost:9000`)});