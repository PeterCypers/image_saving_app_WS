const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // await knex(tables.foto).delete();
        // (location, dateUploaded, userID)
        await knex(tables.foto).insert([
            { fotoID: 1, location: 'http://localhost:9000/user2/testimage_001.jpg', dateUploaded: '2024-05-21 00:00:00', userID: 2},
            { fotoID: 2, location: 'http://localhost:9000/user2/testimage_002.jpg', dateUploaded: '2024-05-21 00:00:00', userID: 2},
            { fotoID: 3, location: 'http://localhost:9000/user2/testimage_003.jpg', dateUploaded: '2024-05-22 00:00:00', userID: 2},
            { fotoID: 4, location: 'http://localhost:9000/user2/testimage_004.jpg', dateUploaded: '2024-05-11 00:00:00', userID: 2},
            { fotoID: 5, location: 'http://localhost:9000/user2/testimage_005.jpg', dateUploaded: '2024-05-15 00:00:00', userID: 2},
            { fotoID: 6, location: 'http://localhost:9000/user2/testimage_006.jpg', dateUploaded: '2024-05-15 00:00:00', userID: 2},
            { fotoID: 7, location: 'http://localhost:9000/user2/testimage_007.jpg', dateUploaded: '2024-05-21 00:00:00', userID: 2},
            { fotoID: 8, location: 'http://localhost:9000/user2/testimage_008.jpg', dateUploaded: '2024-05-22 00:00:00', userID: 2},
            { fotoID: 9, location: 'http://localhost:9000/user2/testimage_009.jpg', dateUploaded: '2024-05-11 00:00:00', userID: 2},
            { fotoID: 10, location: 'http://localhost:9000/user2/testimage_010.jpg', dateUploaded: '2024-06-15 00:00:00', userID: 2},
            { fotoID: 11, location: 'http://localhost:9000/user2/testimage_011.jpg', dateUploaded: '2024-06-16 00:00:00', userID: 2},
            { fotoID: 12, location: 'http://localhost:9000/user2/testimage_012.jpg', dateUploaded: '2024-06-17 00:00:00', userID: 2},
            { fotoID: 13, location: 'http://localhost:9000/user2/testimage_013.jpg', dateUploaded: '2024-06-18 00:00:00', userID: 2},
            { fotoID: 14, location: 'http://localhost:9000/user2/testimage_014.jpg', dateUploaded: '2024-06-19 00:00:00', userID: 2},
            { fotoID: 15, location: 'http://localhost:9000/user2/testimage_015.jpg', dateUploaded: '2024-06-20 00:00:00', userID: 2},
            { fotoID: 16, location: 'http://localhost:9000/user2/testimage_016.jpg', dateUploaded: '2024-06-21 00:00:00', userID: 2},
            { fotoID: 17, location: 'http://localhost:9000/user2/testimage_017.jpg', dateUploaded: '2024-06-22 00:00:00', userID: 2},
            { fotoID: 18, location: 'http://localhost:9000/user2/testimage_018.jpg', dateUploaded: '2024-06-23 00:00:00', userID: 2},
            { fotoID: 19, location: 'http://localhost:9000/user2/testimage_019.jpg', dateUploaded: '2024-06-24 00:00:00', userID: 2},
            { fotoID: 20, location: 'http://localhost:9000/user2/testimage_020.jpg', dateUploaded: '2024-06-25 00:00:00', userID: 2},
            { fotoID: 21, location: 'http://localhost:9000/user2/testimage_021.jpg', dateUploaded: '2024-06-26 00:00:00', userID: 2},
            { fotoID: 22, location: 'http://localhost:9000/user2/testimage_022.jpg', dateUploaded: '2024-06-27 00:00:00', userID: 2},
            { fotoID: 23, location: 'http://localhost:9000/user2/testimage_023.jpg', dateUploaded: '2024-06-28 00:00:00', userID: 2},
            { fotoID: 24, location: 'http://localhost:9000/user2/testimage_024.jpg', dateUploaded: '2024-06-29 00:00:00', userID: 2},
        ]);
    },
};