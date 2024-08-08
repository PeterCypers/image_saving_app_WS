const { tables } = require("../../src/data");
const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

//userdata in global setup/teardown

describe("Users", () => {
  let request, knex, authHeader, adminAuthHeader;

  withServer(({ supertest, knex: k }) => {
      request = supertest;
      knex = k;
  });

  beforeAll(async () => {
      authHeader = await login(request);
      adminAuthHeader = await loginAdmin(request);
  });

  const url = "/api/users";

  describe(`POST ${url}/register`,() => {

    // OPGEPAST! -> je test-DB bevat nu 3 users !
    it("should 200 and return the created user", async () => {
      const response = await request.post(`${url}/register`).send({
          email: "testregister@hotmail.com",
          password: "12345678",
      })

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeTruthy();
      //expect(response.body.user.userID).toBe(3); -> == 5 -> auto-increments issue -> see seeds/users.js
      expect(response.body.user.email).toBe("testregister@hotmail.com");
      expect(response.body.user.passwordHash).toBeUndefined();
      expect(response.body.user.roles[0]).toBe("user");
      expect(response.body.user.roles).toHaveLength(1); // enkel "user" rol, geen "admin"
    })

    it("should 400 when missing email", async () => {
      const response = await request.post(`${url}/register`).send({
          // email: "register@hogent.be",
          password: "12345678",
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("email");
    })

    it("should 400 when invalid email", async () => {
      const response = await request.post(`${url}/register`).send({
          email: "registerhogent.be", // standard email validation, must contain '@'
          password: "12345678",
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("email");
    })

    it("should 400 when missing password", async () => {
      const response = await request.post(`${url}/register`).send({
          email: "register@hogent.be",
          //password: "12345678",
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("password");
    })

    it("should 400 when password length too short", async () => {
      const response = await request.post(`${url}/register`).send({
          email: "register@hogent.be",
          password: "1234567",
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("password");
    })

    it("should 400 when password length too long", async () => {
      const response = await request.post(`${url}/register`).send({
          email: "register@hogent.be",
          password: "abcdefghijklmnopqrstuvwxyz12345", // length = 31
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("password");
    })
  })

  describe(`POST ${url}/login`,() => {

    it("should 200 and return the logged in user", async () => {
      const response = await request.post(`${url}/login`).send({
          email: "test.user@hogent.be",
          password: "12345678",
      })

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.userID).toBe(1);
      expect(response.body.user.email).toBe("test.user@hogent.be");
      expect(response.body.user.passwordHash).toBeUndefined();
      expect(response.body.user.roles[0]).toBe("user");
      expect(response.body.user.roles).toHaveLength(1); // enkel "user" rol, geen "admin"
    })

    it("should 200 and return the logged in admin", async () => {
      const response = await request.post(`${url}/login`).send({
          email: "test.admin@hogent.be",
          password: "12345678",
      })
      
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.userID).toBe(2);
      expect(response.body.user.email).toBe("test.admin@hogent.be");
      expect(response.body.user.passwordHash).toBeUndefined();
      expect(response.body.user.roles).toHaveLength(2); // "user" rol & "admin" rol
    })

    it("should 400 when missing email", async () => {
      const response = await request.post(`${url}/login`).send({
          // email: "test.user@hogent.be",
          password: "12345678",
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("email");
    })

    it("should 400 when missing password", async () => {
      const response = await request.post(`${url}/login`).send({
          email: "test.user@hogent.be",
          //password: "12345678",
      })

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("password");
    })

    it("should 401 when incorrect password", async () => {
      const response = await request.post(`${url}/login`).send({
          email: "test.user@hogent.be",
          password: "87654321",
      })

      expect(response.statusCode).toBe(401);
      expect(response.body.code).toBe("UNAUTHORIZED");
      expect(response.body.message).toBe("The given email or password do not match");
    })

  })

  describe(`GET ${url}/`, () => {

    it("should 200 and return all users when admin", async () => {
        const response = await request.get(url)
            .set("Authorization", adminAuthHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(3); //zie register
        expect(response.body.items.length).toBe(3); //zie register
    })

    //non admin tries to get all users:
    it("should 403 when not an admin", async () => {
      const response = await request.get(url)
          .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
      expect(response.body.message).toBe("You are not allowed to view this part of the application");
  })

    it("should 400 when given an argument", async () => {
        const response = await request
            .get(`${url}?invalid=true`)
            .set("Authorization", adminAuthHeader);

        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe("VALIDATION_FAILED");
        expect(response.body.details.query).toHaveProperty("invalid");
    })

    testAuthHeader(() => request.get(url));
  })

  describe(`GET ${url}/:id`, () => {

    it("should 200 and return user when admin", async () => {
      const response = await request.get(`${url}/1`)
          .set("Authorization", adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.userID).toBe(1);
      expect(response.body.email).toBe("test.user@hogent.be");
      expect(response.body.roles[0]).toBe("user");
    })

    it("should 200 and return user 1 when user 1", async () => {
      const response = await request.get(`${url}/1`)
          .set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.userID).toBe(1);
      expect(response.body.email).toBe("test.user@hogent.be");
      expect(response.body.roles[0]).toBe("user");
    })

    it("should 403 when requesting to see user 2 as user 1", async () => {
      const response = await request.get(`${url}/2`)
          .set("Authorization", authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body.code).toBe("FORBIDDEN");
      expect(response.body.message).toBe("You are not allowed to view this user's information");
    })

    testAuthHeader(() => request.get(`${url}/1`));
  })

  //describe [users] PUT nvt in mijn applicatie
  //describe [users] DELETE nvt in mijn applicatie
})
