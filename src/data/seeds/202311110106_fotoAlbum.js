const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // await knex(tables.fotoalbum).delete();
        // (albumName, creationDate, userID)  
        await knex(tables.fotoalbum).insert([
            { albumID: 1, albumName: 'one', creationDate: '2023-10-21 00:00:00', userID: 1 },
            { albumID: 2, albumName: 'two', creationDate: '2023-10-21 00:00:00', userID: 2 },
            { albumID: 3, albumName: 'three', creationDate: '2023-10-22 00:00:00', userID: 3 },
            { albumID: 4, albumName: 'four', creationDate: '2023-11-11 00:00:00', userID: 4 },
            { albumID: 5, albumName: 'five', creationDate: '2023-11-15 00:00:00', userID: 5 },
            { albumID: 6, albumName: 'six', creationDate: '2023-11-15 00:00:00', userID: 6 },
        ]);
    },
};