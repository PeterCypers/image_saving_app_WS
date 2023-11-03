const placeRepository = require('../repository/place');

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
    throw Error(`No place with id ${id} exists`, { id });
  }

  return place;
};

const create = async ({ name, rating }) => {
  const id = await placeRepository.create({ name, rating });
  return getById(id);
};

const updateById = async (id, { name, rating }) => {
  await placeRepository.updateById(id, { name, rating });
  return getById(id);
};

const deleteById = async (id) => {
  const deleted = await placeRepository.deleteById(id);

  if (!deleted) {
    throw Error(`No place with id ${id} exists`, { id });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
