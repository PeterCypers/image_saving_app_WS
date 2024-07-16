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
// nieuwe functie nodig om alle fotos voor 1 gebruiker terug te geven:
const getAllByUserId = async (userID) => {
  const items = await fotoRepository.findAllByUserId(userID);
  return {
    items,
    count: items.length,
  };
};

const getById = async (userID, fotoID) => {
  const items = await fotoRepository.findById(userID, fotoID);

  if (!items) {
    throw Error(`No foto with id ${id} exists`, { fotoID });
  }

  return {
    items,
    count: items.length,
  };
};

const create = async ({ location, dateUploaded, userID }) => {
  /*const id =*/ //await fotoRepository.create({ location, dateUploaded, userID });
  //return getById(id);
  const existingFoto = await fotoRepository.findByLocation(location);
  if (existingFoto) {
    return existingFoto; // Return the existing entry if it already exists
  }
  await fotoRepository.create({ location, dateUploaded, userID });
};

// TODO: rework to getting 2 parameters
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
  getAllByUserId,
};
