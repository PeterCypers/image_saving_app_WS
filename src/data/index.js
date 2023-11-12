const knex = require('knex');
const { getLogger } = require('../core/logging');
const { join } = require('path');

const config = require('config');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');

let knexInstance;

async function initializeData() {
  const logger = getLogger();
  logger.info('Initializing connection to the database');

  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      // database: DATABASE_NAME, //(*)
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    // debug: isDevelopment,
    migrations: { //put in comment along with below try-catch to work without migrations
      tableName: 'knex_meta',
      directory: join('src', 'data', 'migrations'),
    },
    seeds: {
      directory: join('src', 'data', 'seeds'),
    }
  };

  knexInstance = knex(knexOptions);

  try {
    await knexInstance.raw('SELECT 1+1 AS result');
    // code toegevoegd voor migrations: //TODO: (*)dit kan een fout geven vanwege gelimiteerde permissies op de database, als dat zo is: zet bovenstaande code weer uit commentaar en dit in commentaar
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    await knexInstance.destroy();
    knexOptions.connection.database=DATABASE_NAME;
    knexInstance=knex(knexOptions);
    await knexInstance.raw('SELECT 1+1 AS result');
    // end code toegevoegd migrations
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error('Could not initialize the data layer');
  }
  // migrations (creating database/tables)
  try {
    await knexInstance.migrate.latest(); //migrations try-catch in comment to work w/o migrations

  } catch (error){
    logger.error('Migrations failed', {error});
    throw new Error('Migrations failed');
  }
  // seeding (adding testvalues to tables (mag alleen in development))
  if (isDevelopment) {
    try {
      await knexInstance.seed.run();
    } catch (error) {
      logger.error("Seeding failed", {error});
    }
  }

  return knexInstance;
}

function getKnex() {
  if (!knexInstance)
    throw new Error(
      'Please initialize the data layer before getting the Knex instance'
    );
  return knexInstance;
}

const tables = Object.freeze({
  users: 'users',
  foto: 'foto',
  fotoalbum: 'fotoalbum',
  fotoalbum_foto: 'fotoalbum_foto'
});

module.exports = {
  initializeData,
  getKnex,
  tables,
};
