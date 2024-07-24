const Router = require('@koa/router');
const Joi = require('joi');
const userService = require('../service/user');
const validate = require('../core/validation');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

/**
 * Check if the signed in user can access the given user's information.
 */
const checkUserId = (ctx, next) => {
  const { userID, roles } = ctx.state.session;
  const { id } = ctx.params;

  // Users can only access their own data |  Admins can access everyone's data
  if (id !== userID && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};

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

  // No authorisation -> login & register to obtain JWT
  router.post(
    '/login',
    validate(login.validationScheme),
    login
  );
  router.post(
    '/register',
    validate(register.validationScheme),
    register
  );

  // Only admin access endpoint getAll users
  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/',
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );

  // Authorization required -> only logged in users
  router.get(
    '/:id',
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById
  );
  router.put(
    '/:id',
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
