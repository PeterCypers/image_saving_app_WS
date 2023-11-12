const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.foto).delete();
        // (location, dateUploaded, userID)
        await knex(tables.foto).insert([
            { location: '../assets/foto1', dateUploaded: '2023-10-21 00:00:00', userID: 1},
            { location: '../assets/foto2', dateUploaded: '2023-10-21 00:00:00', userID: 2},
            { location: '../assets/foto3', dateUploaded: '2023-10-22 00:00:00', userID: 3},
            { location: '../assets/foto4', dateUploaded: '2023-11-11 00:00:00', userID: 4},
            { location: '../assets/foto5', dateUploaded: '2023-11-15 00:00:00', userID: 5},
            { location: '../assets/foto6', dateUploaded: '2023-11-15 00:00:00', userID: 6},
        ]);
    },
};