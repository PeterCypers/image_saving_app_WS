// TODO: houd logging op true tot het einde waar je dit op false moet zetten
module.exports = {
    logging : {
        level:"silly",
        disabled:true
    },
    cors: {
      origins: ['http://localhost:5173'], 
      maxAge: 3 * 60 * 60, 
    },
    database: {
      client: 'mysql2',
      host: 'localhost',
      port: 3306,
      name: '185333pc_test', //nieuw lokaal DB voor testen
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