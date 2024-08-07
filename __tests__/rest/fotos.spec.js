//const supertest= require('supertest'); //(in withServer)
//const createServer = require('../../src/createServer'); //(in withServer)
const {/*getKnex,(in withServer)*/ tables} = require('../../src/data');

const { withServer, login } = require('../supertest.setup'); // 👈 2 en 3
const { testAuthHeader } = require('../common/auth'); // 👈 5

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
    // zit nu in global setup
    // users: [{
    //     userID: 1,
    //     firstName: 'test',
    //     lastName: 'user1',
    //     passwordHash: '123456'
    // }]
}

const dataToDelete = {
    fotos: [1,2,3]
    //users: [1]
}

describe("foto", () => {
    //let server;
    let request, knex, authHeader;

    withServer(({supertest,knex: k,}) => {
        request = supertest;
        knex = k;
      });

    beforeAll(async() => {
        //(in supertest.setup.withServer)
        // server = await createServer();
        // request = supertest(server.getApp().callback());
        // knex = getKnex();
        
        authHeader = await login(request);
    });

    //(in supertest.setup.withServer)
    // afterAll(async() => {
    //     await server.stop();
    // })

    //overal waar 'users' in voorkomt afgehandeld in setup/teardown -> verwijder||in-comment (vooral insert/delete)

    const url = '/api/fotos';
    describe('Get /api/fotos', () => {
        beforeAll(async()=> {
            //volgorde belangrijk
            //await knex(tables.users).insert(data.users);
            await knex(tables.foto).insert(data.fotos);
        })

        afterAll(async()=> {
            await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
            //await knex(tables.users).whereIn('userID', dataToDelete.users).delete();
        })

        it('should return 200 and all fotos', async() => {
            const response = await request.get(url).set('Authorization', authHeader); //zie __tests__/common/auth.js
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