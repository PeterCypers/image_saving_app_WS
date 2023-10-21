module.exports = {
    logging : {
        level:"info",
        disabled:false
    },
    cors: {
      origins: ['http://localhost:5173'],
      maxAge: 3 * 60 * 60,
    },
}