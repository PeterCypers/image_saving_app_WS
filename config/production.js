module.exports = {
    logging : {
        level:"info",
        disabled:false
    },
    cors: {
      origins: ['http://localhost:5173'],
      maxAge: 3 * 60 * 60,
    },
    // TODO database -> production db = de gekregen DB
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