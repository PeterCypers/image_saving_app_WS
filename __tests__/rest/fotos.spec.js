//const supertest= require('supertest'); //(in withServer)
//const createServer = require('../../src/createServer'); //(in withServer)
const {/*getKnex,(in withServer)*/ tables} = require('../../src/data');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
    fotos: [{
        fotoID: 1,
        location: 'public/uploads/user1/foto1',
        dateUploaded: new Date(2021, 0, 0, 0, 0),
        userID: 1
    },
    {
        fotoID: 2,
        location: 'public/uploads/user1/foto2',
        dateUploaded: new Date(2021, 1, 1, 1, 1),
        userID: 1
    },
    {
        fotoID: 3,
        location: 'public/uploads/user1/foto3',
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

describe("Fotos", () => {
    //let server;
    let request, knex, authHeader, adminAuthHeader; // admin mostly used as a regular 2nd user

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
        adminAuthHeader = await loginAdmin(request);
    });

    //(in supertest.setup.withServer)
    // afterAll(async() => {
    //     await server.stop();
    // })

    //overal waar 'users' in voorkomt afgehandeld in setup/teardown -> verwijder||in-comment (vooral insert/delete)

    const url = '/api/fotos';
    describe(`GET ${url}/`, () => {
        beforeAll(async()=> {
            //volgorde belangrijk
            //await knex(tables.users).insert(data.users);
            await knex(tables.foto).insert(data.fotos);
        });

        afterAll(async()=> {
            await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
            //await knex(tables.users).whereIn('userID', dataToDelete.users).delete();
        });

        it('should return 200 and all fotos of the current user', async() => {
            const response = await request.get(url).set('Authorization', authHeader); //zie __tests__/common/auth.js
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);
            expect(response.body.items[0]).toEqual({
                fotoID: 3,
                location: 'public/uploads/user1/foto3',
                dateUploaded: new Date(2021, 2, 2, 2, 2).toJSON(),
                userID: 1
            });
            expect(response.body.items[1]).toEqual({
                fotoID: 2,
                location: 'public/uploads/user1/foto2',
                dateUploaded: new Date(2021, 1, 1, 1, 1).toJSON(),
                userID: 1
            });
            expect(response.body.items[2]).toEqual({
                fotoID: 1,
                location: 'public/uploads/user1/foto1',
                dateUploaded: new Date(2021, 0, 0, 0, 0).toJSON(),
                userID: 1
            });
        })
        testAuthHeader(() => request.get(url));
    })
    // endpoint `POST ${url}/save` -> supertest doet moeilijk met formdata, redelijk complex, moet form-data dependency installeren
    // moet een mock file aanmaken + formdata object
    // en proberen omvormen tot een vorm dat supertest kan lezen... mogelijk streams...
    // er is genoeg error handling aanwezig op FE & BE voor deze endpoint ... ga het uit de tests laten
    
    describe(`GET ${url}/:id`, () => {
        beforeAll(async()=> {
            await knex(tables.foto).insert(data.fotos);
        });

        afterAll(async()=> {
            await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
        });

        it('should return 200 and the foto by fotoId', async() => {
            const response = await request.get(`${url}/1`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                fotoID: 1,
                location: 'public/uploads/user1/foto1',
                dateUploaded: new Date(2021, 0, 0, 0, 0).toJSON(),
                userID: 1
            });
        })

        it('should 404 when getting a foto not in DB', async() => {
            const response = await request.get(`${url}/10`).set('Authorization', authHeader);

            expect(response.status).toBe(404);
            expect(response.body.code).toBe("NOT_FOUND");
            expect(response.body.message).toBe("No foto with id 10 exists");
            expect(response.body.details).toHaveProperty("fotoID");
            expect(response.body.stack).toBeTruthy();
        })

        //user 1 has all fotos, user 2(admin) trying to get user 1's foto
        it('should 404 when requesting another users foto by fotoId', async() => {
            const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);

            expect(response.status).toBe(404);
            expect(response.body.code).toBe("NOT_FOUND");
            expect(response.body.message).toBe("No foto with id 1 exists");
            expect(response.body.details).toHaveProperty("fotoID");
            expect(response.body.stack).toBeTruthy();
        })

        it('should 400 with non-number param', async() => {
            const response = await request.get(`${url}/abc`).set('Authorization', authHeader);

            expect(response.status).toBe(400);
            expect(response.body.code).toBe("VALIDATION_FAILED");
            expect(response.body.details.params).toHaveProperty("id");
            expect(response.body.stack).toBeTruthy();
        })

        testAuthHeader(() => request.get(`${url}/1`));
    })

    describe(`DELETE ${url}/:id`, () => {
        beforeAll(async()=> {
            await knex(tables.foto).insert(data.fotos);
        });

        afterAll(async()=> {
            await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
        });
        // message kan beter... gebruikt getByID en gooit daar een fout...
        it('should 404 when trying to delete another users foto', async() => {
            const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);

            expect(response.status).toBe(404);
            expect(response.body.code).toBe("NOT_FOUND");
            expect(response.body.message).toBe("No foto with id 1 exists");
            expect(response.body.details).toHaveProperty("fotoID");
            expect(response.body.stack).toBeTruthy();
        })

        it('should 204 and delete foto', async() => {
            const response = await request.delete(`${url}/1`).set('Authorization', authHeader);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        })

        it('should 200 and there should be one less foto', async() => {
            const response = await request.get(`${url}`).set('Authorization', authHeader);

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2); // 3 -1 deleted foto

        })

        // maakt niet uit dat foto met ID 1 al weg is, dit moet de juiste errors gooien op auth, voordat we naar de data gaan
        testAuthHeader(() => request.delete(`${url}/1`));
    })
})