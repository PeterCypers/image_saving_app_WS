const Router = require('@koa/router');
const Joi = require('joi');
const placeService = require('../service/place');
const validate = require('../core/validation');
const { requireAuthentication } = require('../core/auth');

const getAllPlaces = async (ctx) => {
  ctx.body = await placeService.getAll();
};
getAllPlaces.validationScheme = null;

const createPlace = async (ctx) => {
  const place = await placeService.create({
    ...ctx.request.body,
    rating: Number(ctx.request.body.rating),
  });
  ctx.status = 201;
  ctx.body = place;
};
createPlace.validationScheme = {
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().integer().min(1).max(5),
  },
};

const getPlaceById = async (ctx) => {
  ctx.body = await placeService.getById(Number(ctx.params.id));
};
getPlaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updatePlace = async (ctx) => {
  ctx.body = await placeService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    rating: Number(ctx.request.body.rating),
  });
};
updatePlace.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string().max(255),
    rating: Joi.number().integer().min(1).max(5),
  },
};

const deletePlace = async (ctx) => {
  await placeService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deletePlace.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install places routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/places',
  });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllPlaces.validationScheme),
    getAllPlaces
  );
  router.post(
    '/',
    validate(createPlace.validationScheme),
    createPlace
  );
  router.get(
    '/:id',
    validate(getPlaceById.validationScheme),
    getPlaceById
  );
  router.put(
    '/:id',
    validate(updatePlace.validationScheme),
    updatePlace
  );
  router.delete(
    '/:id',
    validate(deletePlace.validationScheme),
    deletePlace
  );

  app.use(router.routes()).use(router.allowedMethods());
};
