const Router = require('@koa/router');
const Joi = require('joi');
const userService = require('../service/user');
const validate = require('../core/validation');

const getAllUsers = async (ctx) => {
  const users = await userService.getAll();
  ctx.body = users;
};
getAllUsers.validationScheme = null;

const register = async (ctx) => {
  const tokenAndExposedUser = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = tokenAndExposedUser;
};
register.validationScheme = {
  body: {
    email: Joi.string().max(255).email(),
    password: Joi.string().min(8).max(30),
  },
};

const login = async (ctx/*, next*/) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);

  ctx.body = token;
};
login.validationScheme = {
  body: {
    email: Joi.string().max(255).email(),
    password: Joi.string().min(8).max(30),
  },
};

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    email: Joi.string().max(255).email(),
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUserRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  router.get(
    '/',
    validate(getAllUsers.validationScheme),
    getAllUsers
  );
  router.get(
    '/:id',
    validate(getUserById.validationScheme),
    getUserById
  );
  router.post(
    '/register',
    validate(register.validationScheme),
    register
  );
  router.post(
    '/login',
    validate(login.validationScheme),
    login
  );
  router.put(
    '/:id',
    validate(updateUserById.validationScheme),
    updateUserById
  );
  router.delete(
    '/:id',
    validate(deleteUserById.validationScheme),
    deleteUserById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
