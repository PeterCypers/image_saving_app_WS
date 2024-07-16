const config = require('config');
const bodyParser = require('koa-bodyparser'); // middleware
const koaCors = require('@koa/cors');
const emoji = require('node-emoji');
const { getLogger } = require('./logging');
const ServiceError = require('./serviceError');
const koaHelmet = require('koa-helmet');

/**
 * nodig voor static-fileserving
 */
const path = require('path');
const serve = require('koa-static');

/** werken met multipart forms & file uploads:
 * https://www.npmjs.com/package/koa-body
 * geen default-import, moet tussen {}
*/
const { koaBody } = require('koa-body');

const NODE_ENV = config.get('env');
const CORS_ORIGINS = config.get('cors.origins'); //@koa/cors
const CORS_MAX_AGE = config.get('cors.maxAge'); //@koa/cors

/**
 * 1. Cors
 *
 * 2. request logging -> method + url, <- method + url + status (bij het terugkeren in dit deel van de onion heen-en-weer door middleware chain -> zie onion model)
 *
 * 3. bodyParser
 *
 * 4. error handling -> / , <- fouten verder afhandelen (op de terugweg)
 *
 * 5. validatie
 *
 * 6. endpoint uitvoeren
 *
 * @param {*} app 
 */
module.exports = function installMiddleware(app) {

  // 0. CyberSec WS-H6
  app.use(koaHelmet());

  // 1. Cors
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

  // 2. logging
  app.use(async (ctx, next) => {
    getLogger().info(`${emoji.get('fast_forward')} ${ctx.method} ${ctx.url}`);

    const getStatusEmoji = () => {
      if (ctx.status >= 500) return emoji.get('skull');
      if (ctx.status >= 400) return emoji.get('x');
      if (ctx.status >= 300) return emoji.get('rocket');
      if (ctx.status >= 200) return emoji.get('white_check_mark');
      return emoji.get('rewind');
    };

    try {
      await next();

      getLogger().info(
        `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`
      );
    } catch (error) {
      getLogger().error(
        `${emoji.get('x')} ${ctx.method} ${ctx.status} ${ctx.url}`,
        {
          error,
        }
      );

      throw error;
    }
  });

  // 3. bodyparser
  app.use(bodyParser());

  // 3.5 custom body parsing
  app.use(koaBody({ multipart: true }));

  //koa-static needs to know which folder contains the files that are public
  //TODO: vraag: security probleem? de files zijn nu publiek toegankelijk, hoe kan dit opgelost worden
  const publicDir = path.join(__dirname, '../../public');
  app.use(serve(path.join(publicDir, 'uploads')));

  // 4. error handling
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      getLogger().error('Error occured while handling a request', { error });
      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message,
        details: error.details || {},
        stack: NODE_ENV !== 'production' ? error.stack : undefined,
      };

      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });

  // Handle 404 not found with uniform response
  app.use(async (ctx, next) => {
    await next();

    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = {
        code: 'NOT_FOUND',
        message: `Unknown resource: ${ctx.url}`,
      };
    }
  });

}
