module.exports = {
    protocol: "http",
    hostname: "localhost",
    port: 9000,
    logging : {
        level:"silly",
        disabled:false
    },
    cors: {
      origins: ['http://localhost:5173'], 
      maxAge: 3 * 60 * 60, 
    },
    database: {
      client: 'mysql2',
      host: 'localhost',
      port: 3306,
      name: '185333pc',
      username: 'root',
      password: '',
    },
    auth: {
      argon: {
        saltLength: 16,
        hashLength: 32,
        timeCost: 6,
        memoryCost: 2 ** 17,
      },
      jwt: {
        secret: 'overwrittenbyvalueinsideenvironmentfile',
        expirationInterval: 60 * 60 * 1000, // ms (1 hour)
        // expirationInterval: 5 * 1000, // extra short expiry for testing(5 sec)
        issuer: 'fotos.hogent.be',
        audience: 'fotos.hogent.be',
      },
    },
}