const supertest= require('supertest');
const createServer = require('../src/createServer');
const {getKnex, tables} = require('../src/data');

//TODO: verder testing na login/authenticatie afgewerkt
// user has: userID | email | passwordHash | roles
const data = {
    fotos: [{
        fotoID: 1,
        location: 'fotos/foto1',
        dateUploaded: new Date(2021, 0, 0, 0, 0),
        userID: 1
    },
    {
        fotoID: 2,
        location: 'fotos/foto2',
        dateUploaded: new Date(2021, 1, 1, 1, 1),
        userID: 1
    },
    {
        fotoID: 3,
        location: 'fotos/foto3',
        dateUploaded: new Date(2021, 2, 2, 2, 2),
        userID: 1
    }],
    // TODO user aanpassen op nieuwe db-structuur user-table
    users: [{
        userID: 1,
        firstName: 'test',
        lastName: 'user1',
        passwordHash: '123456'
    }]
}

const dataToDelete = {
    fotos: [1,2,3],
    users: [1]
}

describe("foto", () => {
    let server;
    let request;
    let knex;

    beforeAll(async() => {
        server = await createServer();
        request = supertest(server.getApp().callback());
        knex = getKnex();
    })

    afterAll(async() => {
        await server.stop();
    })

    const url = '/api/fotos';
    describe('Get /api/fotos', () => {
        beforeAll(async()=> {
            //volgorde belangrijk
            await knex(tables.users).insert(data.users);
            await knex(tables.foto).insert(data.fotos);
        })

        afterAll(async()=> {
            await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
            await knex(tables.users).whereIn('userID', dataToDelete.users).delete();
        })

        it('should return 200 and all fotos', async() => {
            const response = await request.get(url);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);
            expect(response.body.items[0]).toEqual({
                fotoID: 3,
                location: 'fotos/foto3',
                dateUploaded: new Date(2021, 2, 2, 2, 2).toJSON(),
                userID: 1
            });
            expect(response.body.items[1]).toEqual({
                fotoID: 2,
                location: 'fotos/foto2',
                dateUploaded: new Date(2021, 1, 1, 1, 1).toJSON(),
                userID: 1
            });
            expect(response.body.items[2]).toEqual({
                fotoID: 1,
                location: 'fotos/foto1',
                dateUploaded: new Date(2021, 0, 0, 0, 0).toJSON(),
                userID: 1
            });
        })
    })
})