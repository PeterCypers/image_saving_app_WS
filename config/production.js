module.exports = {
    logging : {
        level:"info",
        disabled:false
    },
    cors: {
      origins: ['http://localhost:5173'],
      maxAge: 3 * 60 * 60,
    },
    database: {
      client: 'mysql2',
      host: 'vichogent.be',
      port: 40043,
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
        issuer: 'fotos.hogent.be',
        audience: 'fotos.hogent.be',
      },
    },
}