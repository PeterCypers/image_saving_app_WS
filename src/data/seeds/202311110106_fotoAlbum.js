const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // await knex(tables.fotoalbum).delete();
        // (albumName, creationDate, userID)  

        await knex(tables.fotoalbum).insert([
            { albumID: 1, albumName: 'Vacation 2023', creationDate: '2023-10-21 00:00:00', userID: 2 },
            { albumID: 2, albumName: 'Nature Trips', creationDate: '2023-10-21 00:00:00', userID: 2 },
            { albumID: 3, albumName: 'Landscapes', creationDate: '2023-10-22 00:00:00', userID: 2 },
            { albumID: 4, albumName: 'Work Events', creationDate: '2023-11-11 00:00:00', userID: 2 },
            { albumID: 5, albumName: 'Family', creationDate: '2023-11-15 00:00:00', userID: 2 },
            { albumID: 6, albumName: 'Wilderness', creationDate: '2023-11-15 00:00:00', userID: 2 },
        ]);
    },
};