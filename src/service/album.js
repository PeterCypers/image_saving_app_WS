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

  // const existingAlbum = await fotoRepository.findByLocation(location); // only works for fotos, not albums
  // if (existingAlbum) {
  //   return existingAlbum; // Return the existing entry if it already exists
  // }
  // await albumRepository.create({ albumName, creationDate, userID });
};

const create2 = async ({ amount, date, placeId, userId }) => {
  const existingPlace = await placeService.getById(placeId);

  if (!existingPlace) {
    throw ServiceError.notFound(`There is no place with id ${id}.`, { id });
  }

  try {
    const id = await transactionRepository.create({
      amount,
      date,
      userId,
      placeId,
    });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  getAllByUserId,
  create,
};