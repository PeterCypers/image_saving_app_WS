const fotoRepository = require('../repository/foto');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
/**  findAll,
  findById,
  create,
  deleteById, */
const getAll = async (userID) => {
  const items = await fotoRepository.findAll(userID);
  return {
    items,
    count: items.length,
  };
};

const getById = async (fotoID, userID) => {
  const foto = await fotoRepository.findById(fotoID);

  if (!foto || foto.userID !== userID) {
    throw ServiceError.notFound(`No foto with id ${fotoID} exists`, { fotoID });
  }

  return foto;
};

const create = async ({ location, dateUploaded, userID }) => {
  const formattedDate = formatIsoString(dateUploaded/*.toISOString()*/); // dateUploaded is already in ISOString format
  const existingFoto = await fotoRepository.findByLocation(location);
  if (existingFoto) {
    return existingFoto; // Return the existing entry if it already exists
  }
  /*const id =*/ //await fotoRepository.create({ location, dateUploaded, userID });
  //return getById(id);
  await fotoRepository.create({ location, formattedDate, userID });
};

// TODO: rework to getting 2 parameters
const deleteById = async (id) => {
  const deleted = await fotoRepository.deleteById(id);

  if (!deleted) {
    throw Error(`No foto with id ${id} exists`, { id });
  }
};

function formatIsoString(isoString) {
  let date = new Date(isoString);

  // Format the date and time
  let formattedDate = date.getFullYear() + '-' +
                      ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                      ('0' + date.getDate()).slice(-2) + ' ' +
                      ('0' + date.getHours()).slice(-2) + ':' +
                      ('0' + date.getMinutes()).slice(-2) + ':' +
                      ('0' + date.getSeconds()).slice(-2);

  return formattedDate;
}

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
};
