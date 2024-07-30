const placeRepository = require('../repository/place');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const getAll = async () => {
  const items = await placeRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const place = await placeRepository.findById(id);

  if (!place) {
    throw ServiceError.notFound(`No place with id ${id} exists`, { id });
  }

  return place;
};

const create = async ({ name, rating }) => {
  try {
    const id = await placeRepository.create({ name, rating });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, { name, rating }) => {
  try {
    await placeRepository.updateById(id, { name, rating });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await placeRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No place with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
