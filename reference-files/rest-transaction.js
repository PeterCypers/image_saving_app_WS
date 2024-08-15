const Router = require('@koa/router');
const Joi = require('joi');
const validate = require('../src/core/validation');
const { requireAuthentication } = require('../src/core/auth');
const transactionService = require('../src/service/transaction');

const getAllTransactions = async (ctx) => {
  const { userId } = ctx.state.session;
  ctx.body = await transactionService.getAll(userId);
};
getAllTransactions.validationScheme = null;

const createTransaction = async (ctx) => {
  const newTransaction = await transactionService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
    userId: ctx.state.session.userId,
  });
  ctx.status = 201;
  ctx.body = newTransaction;
};
createTransaction.validationScheme = {
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
  },
};

const getTransactionById = async (ctx) => {
  const { userId } = ctx.state.session;
  ctx.body = await transactionService.getById(Number(ctx.params.id), userId);
};
getTransactionById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const updateTransaction = async (ctx) => {
  ctx.body = await transactionService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
    userId: ctx.state.session.userId,
  });
};
updateTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
  },
};

const deleteTransaction = async (ctx) => {
  await transactionService.deleteById(ctx.params.id, ctx.state.session.userId);
  ctx.status = 204;
};
deleteTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/transactions',
  });

  router.use(requireAuthentication);

  router.get(
    '/',
    validate(getAllTransactions.validationScheme),
    getAllTransactions
  );
  router.post(
    '/',
    validate(createTransaction.validationScheme),
    createTransaction
  );
  router.get(
    '/:id',
    validate(getTransactionById.validationScheme),
    getTransactionById
  );
  router.put(
    '/:id',
    validate(updateTransaction.validationScheme),
    updateTransaction
  );
  router.delete(
    '/:id',
    validate(deleteTransaction.validationScheme),
    deleteTransaction
  );

  app.use(router.routes()).use(router.allowedMethods());
};
