const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // await knex(tables.fotoalbum_foto).delete();
        // (fotoID, albumID)
        // bij user2 4 albums, 1: all, 2: 15, 3: 10
        await knex(tables.fotoalbum_foto).insert([
            { fotoID: 1, albumID: 1 },
            { fotoID: 2, albumID: 1 },
            { fotoID: 3, albumID: 1 },
            { fotoID: 4, albumID: 1 },
            { fotoID: 5, albumID: 1 },
            { fotoID: 6, albumID: 1 },
            { fotoID: 7, albumID: 1 },
            { fotoID: 8, albumID: 1 },
            { fotoID: 9, albumID: 1 },
            { fotoID: 10, albumID: 1 },
            { fotoID: 11, albumID: 1 },
            { fotoID: 12, albumID: 1 },
            { fotoID: 13, albumID: 1 },
            { fotoID: 14, albumID: 1 },
            { fotoID: 15, albumID: 1 },
            { fotoID: 16, albumID: 1 },
            { fotoID: 17, albumID: 1 },
            { fotoID: 18, albumID: 1 },
            { fotoID: 19, albumID: 1 },
            { fotoID: 20, albumID: 1 },
            { fotoID: 21, albumID: 1 },
            { fotoID: 22, albumID: 1 },
            { fotoID: 23, albumID: 1 },
            { fotoID: 24, albumID: 1 },

            { fotoID: 1, albumID: 2 },
            { fotoID: 2, albumID: 2 },
            { fotoID: 3, albumID: 2 },
            { fotoID: 4, albumID: 2 },
            { fotoID: 5, albumID: 2 },
            { fotoID: 6, albumID: 2 },
            { fotoID: 7, albumID: 2 },
            { fotoID: 8, albumID: 2 },
            { fotoID: 9, albumID: 2 },
            { fotoID: 10, albumID: 2 },
            { fotoID: 11, albumID: 2 },
            { fotoID: 12, albumID: 2 },
            { fotoID: 13, albumID: 2 },
            { fotoID: 14, albumID: 2 },
            { fotoID: 15, albumID: 2 },

            { fotoID: 1, albumID: 3 },
            { fotoID: 2, albumID: 3 },
            { fotoID: 3, albumID: 3 },
            { fotoID: 4, albumID: 3 },
            { fotoID: 5, albumID: 3 },
            { fotoID: 6, albumID: 3 },
            { fotoID: 7, albumID: 3 },
            { fotoID: 8, albumID: 3 },
            { fotoID: 9, albumID: 3 },
            { fotoID: 10, albumID: 3 },
        ]);
    },
};