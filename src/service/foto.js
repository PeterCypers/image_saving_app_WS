const fotoRepository = require('../repository/foto');
/**  findAll,
  findById,
  create,
  deleteById, */
const getAll = async () => {
  const items = await fotoRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const foto = await fotoRepository.findById(id);

  if (!foto) {
    throw Error(`No foto with id ${id} exists`, { id });
  }

  return foto;
};

const create = async ({ location, dateUploaded, userID }) => {
  const id = await fotoRepository.create({ location, dateUploaded, userID });
  return getById(id);
};

const deleteById = async (id) => {
  const deleted = await fotoRepository.deleteById(id);

  if (!deleted) {
    throw Error(`No foto with id ${id} exists`, { id });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
};
