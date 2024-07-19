const albumRepository = require('../repository/album');

// zal nooit gebruikt worden
const getAll = async () => {
  const items = await albumRepository.findAll();
  return {
    items,
    count: items.length,
  };
};


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
  /*const id =*/ //await fotoRepository.create({ location, dateUploaded, userID });
  //return getById(id);

  // const existingAlbum = await fotoRepository.findByLocation(location); // only works for fotos, not albums
  // if (existingAlbum) {
  //   return existingAlbum; // Return the existing entry if it already exists
  // }
  // await albumRepository.create({ albumName, creationDate, userID });
};

module.exports = {
  getAll,
  getAllByUserId,
  create,
};