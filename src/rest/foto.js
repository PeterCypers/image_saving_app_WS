const Router = require('@koa/router');
const fotoService = require('../service/foto');

const getAllFotos = async (ctx) => {
  ctx.body = await fotoService.getAll();
};
//TODO: hoe ziet de request eruit aan de frontend -> gekozen component structuur?
const createFoto = async (ctx) => {
  const foto = await fotoService.create({
    ...ctx.request.body,
    rating: Date(ctx.request.body.dateUploaded),
  });
  ctx.status = 201;
  ctx.body = place;
};

const getFotoById = async (ctx) => {
  ctx.body = await fotoService.getById(Number(ctx.params.id));
};

const deleteFoto = async (ctx) => {
  await fotoService.deleteById(ctx.params.id);
  ctx.status = 204;
};

/**
 * Install foto routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/fotos',
  });

  router.get('/', getAllFotos);
  router.post('/', createFoto);
  router.get('/:id', getFotoById);
//   router.put('/:id', updateFoto);
  router.delete('/:id', deleteFoto);

  app.use(router.routes()).use(router.allowedMethods());
};
