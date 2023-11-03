const transactionRepository = require('../repository/transaction');
const placeService = require('./place');

const getAll = async () => {
  const items = await transactionRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const transaction = await transactionRepository.findById(id);

  if (!transaction) {
    throw Error(`No transaction with id ${id} exists`, { id });
  }

  return transaction;
};

const create = async ({ amount, date, placeId, userId }) => {
  const existingPlace = await placeService.getById(placeId);

  if (!existingPlace) {
    throw Error(`There is no place with id ${id}.`, { id });
  }

  const id = await transactionRepository.create({
    amount,
    date,
    userId,
    placeId,
  });
  return getById(id);
};

const updateById = async (id, { amount, date, placeId, userId }) => {
  if (placeId) {
    const existingPlace = await placeService.getById(placeId);

    if (!existingPlace) {
      throw Error(`There is no place with id ${id}.`, { id });
    }
  }

  await transactionRepository.updateById(id, {
    amount,
    date,
    userId,
    placeId,
  });
  return getById(id);
};

const deleteById = async (id) => {
  const deleted = await transactionRepository.deleteById(id);

  if (!deleted) {
    throw Error(`No transaction with id ${id} exists`, { id });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
