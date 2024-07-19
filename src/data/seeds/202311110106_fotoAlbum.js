const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // await knex(tables.fotoalbum).delete();
        // (albumName, creationDate, userID)  
        await knex(tables.fotoalbum).insert([
            { albumID: 1, albumName: 'album one', creationDate: '2023-10-21 00:00:00', userID: 2 },
            { albumID: 2, albumName: 'album two', creationDate: '2023-10-21 00:00:00', userID: 2 },
            { albumID: 3, albumName: 'album three', creationDate: '2023-10-22 00:00:00', userID: 2 },
            { albumID: 4, albumName: 'album four', creationDate: '2023-11-11 00:00:00', userID: 2 },
            { albumID: 5, albumName: 'album five', creationDate: '2023-11-15 00:00:00', userID: 2 },
            { albumID: 6, albumName: 'album six', creationDate: '2023-11-15 00:00:00', userID: 2 },
        ]);
    },
};