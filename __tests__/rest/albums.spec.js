const { tables } = require('../../src/data');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');
const { data, dataToDelete } = require('../../src/data/mock_data');
//1ste user heeft alle fotos en albums, er is 1 lege album


/**
 * data and dataToDelete -> check src/data/mock_data.js
 */

describe("Albums", () => {
  let request, knex, authHeader, adminAuthHeader; // admin mostly used as a regular 2nd user

  withServer(({supertest,knex: k,}) => {
      request = supertest;
      knex = k;
    });

  beforeAll(async() => {
      authHeader = await login(request);
      adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/albums';
  describe(`GET ${url}/`, () => {
    beforeAll(async()=> {
      //FK table laatst toevoegen
      await knex(tables.foto).insert(data.fotos);
      await knex(tables.fotoalbum).insert(data.albums);
      await knex(tables.fotoalbum_foto).insert(data.album_fotos);
    });

    afterAll(async()=> {
      //omgekeerde volgorde zou ook mogelijk moeten zijn: foto/album
      await knex(tables.fotoalbum).whereIn('albumID', dataToDelete.albums).delete();
      await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
      //normaal gezien handelt de ondelete:cascade de tussentabel af...
    });

    it('should return 200 and all albums of the current user', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
    })

    testAuthHeader(() => request.get(url));
  })
})