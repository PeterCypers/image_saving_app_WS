module.exports = {
    env: 'NODE_ENV',
    port: 'PORT',
    database: {
      host: 'DATABASE_HOST',
      port: 'DATABASE_PORT',
      name: 'DATABASE_NAME',
      username: 'DATABASE_USERNAME',
      password: 'DATABASE_PASSWORD',
    },
    auth: {
      jwt: {
        secret: 'JWT_SECRET',
      }
    }
}