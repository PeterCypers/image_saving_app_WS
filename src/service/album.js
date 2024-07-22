const albumRepository = require('../repository/album');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

// zal nooit gebruikt worden
const getAll = async () => {
  const items = await albumRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const album = await albumRepository.findById(id);

  if (!album) {
    throw ServiceError.notFound(`No album with id ${id} exists`, { id });
  }

  return album;
}


const getAllByUserId = async (userID) => {
  const items = await albumRepository.findAllByUserId(userID);
  return {
    items,
    count: items.length,
  };
};

// TODO: try-catch + error might be needed -> duplicate -> check vb-app place & handle DB error
// needs complete reworking
const create = async ({ albumName, creationDate, userID }) => {

  try {
    const id = await albumRepository.create({ albumName, creationDate, userID });
    return getById(id);

  } catch (error) {
    throw handleDBError(error);
  }
};

const createAndAddFoto = async ({ albumName, imageID, creationDate, userID }) => {
  try {
    //eerst album aanmaken:
    const albumID = await albumRepository.create({ albumName, creationDate, userID });

    //foto toevoegen -> new record in tussentabel
    return getById(albumID);

  } catch (error) {
    throw handleDBError(error);
  }
}


module.exports = {
  getAll,
  getById,
  getAllByUserId,
  create,
  createAndAddFoto
};