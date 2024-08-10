const { tables } = require('../../src/data');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');
const { data, dataToDelete } = require('../../src/data/mock_data');
//1ste user heeft alle fotos en albums, er is 1 lege album

/**
 * Mock-data?
 * -> data and dataToDelete -> check src/data/mock_data.js
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

    // omdat we in elke test hetzelfde doen: (DRY)
    const setupAndTearDown = () => {
      beforeAll(async () => {
        //FK table laatst toevoegen
        await knex(tables.foto).insert(data.fotos);
        await knex(tables.fotoalbum).insert(data.albums);
        await knex(tables.fotoalbum_foto).insert(data.album_fotos);
      });
  
      afterAll(async () => {
        //omgekeerde volgorde zou ook mogelijk moeten zijn: foto/album
        await knex(tables.fotoalbum).whereIn('albumID', dataToDelete.albums).delete();
        await knex(tables.foto).whereIn('fotoID', dataToDelete.fotos).delete();
        //normaal gezien handelt de ondelete:cascade de tussentabel af...
      });
    };

  const url = '/api/albums';
  describe(`GET ${url}/`, () => {

    setupAndTearDown();

    it('should return 200 and all albums of the current user', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
    });

    it('should return 200 and all albums of the current user empty array if no albums', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(0); // expect empty array
      expect(response.body.count).toBe(0);
    });

    testAuthHeader(() => request.get(url));
  })

  /** TODO endpoints:
   * - get('/:albumID' ✓
   * - get('/:albumID/images' ✓
   * - post('/'               ✓
   * - post('/:albumID/:imageID' ✓
   * - post('/create-and-add-photo' ✓
   * - put('/:albumID' ✓
   * - delete('/:albumID' ✓
   * - delete('/:albumID/images/:imageID'
   */
  describe(`GET ${url}/:albumID`, () => {

    setupAndTearDown();

    it('should return 200 and requested album by Id of the current user', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        albumID: 1,
        albumName: "full album",
        creationDate: new Date(2021, 0, 0, 0, 0).toJSON(),
        userID: 1
      })
    });

    //get by id, the id exists but it belongs to a different user -> generic message(not found) -> anti-hacking
    it('should 404 if current user does not have an album with requested id', async () => {
      //id 1 belongs to user1, attempting to get with user2
      const response = await request.get(`${url}/1`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    testAuthHeader(() => request.get(`${url}/1`));
  })

  describe(`GET ${url}/:albumID/images`, () => {

    setupAndTearDown();

    //images uit album 1 (volle album)
    it('should return 200 and all images contained in album requested by album id 1', async () => {
      const response = await request.get(`${url}/1/images`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(5);
      expect(response.body.count).toBe(5);
      //steekproef laatste in de lijst
      expect(response.body.items[4]).toEqual({
        fotoID: 5,
        location: 'public/uploads/user1/foto5',
        dateUploaded: new Date(2021, 4, 4, 4, 4).toJSON()
      });
    })

    //images uit album 2 (halfvolle(relatief, er is geen limiet) album)
    it('should return 200 and all images contained in album requested by album id 2', async () => {
      const response = await request.get(`${url}/2/images`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);
      expect(response.body.count).toBe(3);
      //steekproef 1ste in de lijst
      expect(response.body.items[0]).toEqual({
        fotoID: 1,
        location: 'public/uploads/user1/foto1',
        dateUploaded: new Date(2021, 0, 0, 0, 0).toJSON()
      });
    })

    //images uit album 3 (lege album)
    it('should return 200 and all images contained in album requested by album id 3', async () => {
      const response = await request.get(`${url}/3/images`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(0);
      expect(response.body.count).toBe(0);
    })

    it('should 404 when requesting nonexistant album images by id', async () => {
      const response = await request.get(`${url}/500/images`).set('Authorization', authHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    //fout ontdekt tijdens testing: je kon een andere gebruiker zijn images opvragen...
    it('should 404 when requesting another users album images by id', async () => {
      const response = await request.get(`${url}/1/images`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    it('should 405 when request has typo', async () => {
      const response = await request.get(`${url}/1/imags`).set('Authorization', authHeader);
      expect(response.status).toBe(405); //postman: Method Not Allowed
      expect(response.body).toEqual({});
    })

    it('should 400 when request has query parameters', async () => {
      const response = await request.get(`${url}/1/images?invalid=true`).set('Authorization', authHeader);
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details).toHaveProperty("query");
    })

    testAuthHeader(() => request.get(`${url}/1/images`));
  })

  describe(`POST ${url}/`, () => {

    setupAndTearDown();

    it('should return 201 and the new album when creating a new album', async () => {
      const response = await request.post(`${url}/`).set('Authorization', authHeader).send({
        albumName: "testNewAlbumPost"
      });

      expect(response.status).toBe(201);
      expect(response.body.albumID).toBeGreaterThan(3); //id ligt hoger dan aantal albums die al aanwezig waren
      expect(response.body.albumName).toBe("testNewAlbumPost");
      expect(response.body.userID).toBe(1);
      //creationDate moet ~ huidige tijd zijn
      const albumCreationDateInSeconds = Math.floor(new Date(response.body.creationDate).getTime() / 1000);
      const timeNowInSeconds = Math.floor(new Date().getTime() / 1000); 
      expect(albumCreationDateInSeconds).toEqual(expect.closeTo(timeNowInSeconds));
    })

    it('should 400 when empty body', async () => {
      const response = await request.post(`${url}/`).set('Authorization', authHeader).send({});
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("albumName");
      expect(response.body.details.body.albumName[0].message).toMatch(/is required/);
    })

    //albumname ipv albumName
    it('should 400 when wrong property name', async () => {
      const response = await request.post(`${url}/`).set('Authorization', authHeader).send({
        albumname: "testNewAlbumPost"
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("albumName");
      expect(response.body.details.body.albumName[0].message).toMatch(/is required/);
    })

    //albumName leeg of enkel spaties
    it('should 400 when albumName is empty or blank', async () => {
      const response = await request.post(`${url}/`).set('Authorization', authHeader).send({
        albumName: "   "
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("albumName");
      expect(response.body.details.body.albumName[0].message).toMatch(/is not allowed to be empty/);
    })

    //albumName te lang
    it('should 400 when albumName is more than 25 tokens', async () => {
      const response = await request.post(`${url}/`).set('Authorization', authHeader).send({
        albumName: "12345678901234567890123456"
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("albumName");
      expect(response.body.details.body.albumName[0].message).toMatch(/length must be less than or equal to 25 characters long/);
    })

    testAuthHeader(() => request.post(`${url}/`));
  })

  describe(`POST ${url}/:albumID/:imageID`, () => {

    setupAndTearDown();

    // ! hierna zal de 2de album 4 fotos bevatten !
    it('should return 201 and the added album-foto', async () => {
      const response = await request.post(`${url}/2/4`).set('Authorization', authHeader).send({});

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        fotoID: 4,
        albumID: 2
      })
    })

    //nu moeten we bij het ophalen van de images van albumID 2 de 4 fotos hebben
    it('should return 200 and the album with 4 fotos', async () => {
      const response = await request.get(`${url}/2/images`).set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(4);
    })

    //dezelfde foto nog eens proberen toevoegen moet error gooien
    it('should return 400 when fotoID already exists in album', async () => {
      const response = await request.post(`${url}/2/4`).set('Authorization', authHeader).send({});
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details).toHaveProperty("fotoID");
      expect(response.body.stack).toBeTruthy();
    })

    // CASE NIET AFGEHANDELD: het is mogelijk om een foto van iemand anders aan je eigen album toe te voegen op dit moment (met postman)

    testAuthHeader(() => request.post(`${url}/:albumID/:imageID`));
  })

  //verwacht zeer gelijkaardig errors zoals bij nieuw album post
  describe(`POST ${url}/create-and-add-photo`, () => {

    setupAndTearDown();

    it('should return 201 and the newly created album, and have added a new album to users albums', async () => {
      const response = await request.post(`${url}/create-and-add-photo`).set('Authorization', authHeader)
      .send({
        albumName: "New Album With Foto Test",
        fotoID: 1
      });
      expect(response.status).toBe(201);
      expect(response.body.albumID).toBeGreaterThan(3); //id ligt hoger dan aantal albums die al aanwezig waren
      expect(response.body.albumName).toBe("New Album With Foto Test");
      expect(response.body.userID).toBe(1);
      //creationDate moet ~ huidige tijd zijn
      const albumCreationDateInSeconds = Math.floor(new Date(response.body.creationDate).getTime() / 1000);
      const timeNowInSeconds = Math.floor(new Date().getTime() / 1000); 
      expect(albumCreationDateInSeconds).toEqual(expect.closeTo(timeNowInSeconds));
    })

    it('should return 200 and all albums, new album should have been added', async () => {
      const response = await request.get(`${url}/`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.count).toBeGreaterThan(3); //album = toegevoegd
    })

    //unicity op albumName per userID -> duplikaat album namen mogen voorkomen in de database, maar nooit bij dezelfde gebruiker
    it('should 400 when adding a duplicate album name for the current user', async () => {
      const response = await request.post(`${url}/create-and-add-photo`).set('Authorization', authHeader)
      .send({
        albumName: "New Album With Foto Test",
        fotoID: 1 //fotoID is niet relevant voor de case, mag hetzelfde zijn
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details).toHaveProperty("albumName");
      expect(response.body.stack).toBeTruthy();
    })

    //empty | blank
    it('should 400 when creating an album with an empty or blank albumName', async () => {
      const response = await request.post(`${url}/create-and-add-photo`).set('Authorization', authHeader)
      .send({
        albumName: "      ",
        fotoID: 1
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("albumName");
      expect(response.body.details.body.albumName[0].message).toMatch(/is not allowed to be empty/);
    })

    //te lang
    it('should 400 when albumname exceeds 25 tokens', async () => {
      const response = await request.post(`${url}/create-and-add-photo`).set('Authorization', authHeader)
      .send({
        albumName: "12345678901234567890123456",
        fotoID: 1
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("albumName");
      expect(response.body.details.body.albumName[0].message).toMatch(/length must be less than or equal to 25 characters long/);
    })

    testAuthHeader(() => request.post(`${url}/create-and-add-photo`));
  })


  describe(`PUT ${url}/:albumID`, () => {

    setupAndTearDown();

    it('should return 200 and the modified album by id', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', authHeader)
      .send({
        newName: "testNameChange"
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        albumID: 1,
        albumName: "testNameChange",
        creationDate: new Date(2021, 0, 0, 0, 0).toJSON(),
        userID: 1
      });
    })

    //nu dat album 1 deze naam heeft, probeer album 2 dezelfde naam te geven:
    it('should 400 if there already is an album with the requested name for this user', async () => {
      const response = await request.put(`${url}/2`).set('Authorization', authHeader)
      .send({
        newName: "testNameChange"
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details).toHaveProperty("newName");
      expect(response.body.stack).toBeTruthy();
    })

    //probeer een album van een andere user van naam te veranderen -> generiek error vs hackers
    it('should 404 when trying to change another users albumName by albumId', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', adminAuthHeader)
      .send({
        newName: "trychangeOther"
      });
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    //handelt ook de case waar deze user geen albums heeft
    it('should 404 when album not found for this user', async () => {
      const response = await request.put(`${url}/1000`).set('Authorization', authHeader)
      .send({
        newName: "testNameChangeB"
      });
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    //ongeldig json
    it('should 400 when newName invalid fieldname', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', authHeader)
      .send({
        new: "testNameChangeC"
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("newName");
      expect(response.body.details.body.newName[0].message).toMatch(/is required/);
    })

    //lege naam of enkel spaties
    it('should 400 when newName is empty or blank', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', authHeader)
      .send({
        newName: ""
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("newName");
      expect(response.body.details.body.newName[0].message).toMatch(/is not allowed to be empty/);
    })

    //naam te lang
    it('should 400 when newName exceeds 25 tokens', async () => {
      const response = await request.put(`${url}/1`).set('Authorization', authHeader)
      .send({
        newName: "12345678901234567890123456"
      });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("newName");
      expect(response.body.details.body.newName[0].message).toMatch(/length must be less than or equal to 25 characters long/);
    })

    testAuthHeader(() => request.put(`${url}/1`));
  })


  describe(`DELETE ${url}/:albumID`, () => {

    setupAndTearDown();

    it('should 204 and delete the requested album by id', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', authHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    })

    it('should 404 when trying to get the deleted album', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    //probeer album 2 te deleten met user 2 (album 1 is al weg)
    it('should 404 when trying to delete another users album by id', async () => {
      const response = await request.delete(`${url}/2`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    it('should 404 when trying to delete a nonexistant album by id', async () => {
      const response = await request.delete(`${url}/100`).set('Authorization', authHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    testAuthHeader(() => request.delete(`${url}/1`));
  })

  //delete('/:albumID/images/:imageID'
  describe(`DELETE ${url}/:albumID/images/:imageID`, () => {

    setupAndTearDown();

    it('should 204 and delete the requested image by id', async () => {
      const response = await request.delete(`${url}/1/images/1`).set('Authorization', authHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    })

    it('should return 200 and one less image in the album with id 1', async () => {
      const response = await request.get(`${url}/1/images`).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(4); // 1 image minder in de 'volle album'
      //de eerste foto zou weg moeten zijn, nu zit de 2de foto op de 1ste plaats
      expect(response.body.items[0]).toEqual({
        fotoID: 2,
        location: 'public/uploads/user1/foto2',
        dateUploaded: new Date(2021, 1, 1, 1, 1).toJSON()
      });
    })

    it('should 404 when trying to delete an image from another users album by id', async () => {
      const response = await request.delete(`${url}/1/images/2`).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.details).toHaveProperty("albumID");
      expect(response.body.stack).toBeTruthy();
    })

    testAuthHeader(() => request.delete(`${url}/1/images/1`));
  })
})