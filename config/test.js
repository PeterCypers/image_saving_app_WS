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
}