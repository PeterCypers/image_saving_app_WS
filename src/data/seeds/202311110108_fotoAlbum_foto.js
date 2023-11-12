const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.fotoalbum_foto).delete();
        // (fotoID, albumID)
        await knex(tables.fotoalbum_foto).insert([
            { fotoID: 1, albumID: 1 },
            { fotoID: 2, albumID: 2 },
            { fotoID: 3, albumID: 3 },
            { fotoID: 4, albumID: 4 },
            { fotoID: 5, albumID: 5 },
            { fotoID: 6, albumID: 6 },
        ]);
    },
};