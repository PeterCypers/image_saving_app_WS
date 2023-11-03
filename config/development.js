module.exports = {
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
}
//TODO: waarden aanpassen op mijn eigen database -> controle of werkt