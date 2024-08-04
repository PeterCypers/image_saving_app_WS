const albumRepository = require('../repository/album');
const albumFotoService = require('./album_foto');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

const getAll = async (userID) => {
  const items = await albumRepository.findAll(userID);
  return {
    items,
    count: items.length,
  };
};

const getById = async (albumID, userID) => {
  const album = await albumRepository.findById(albumID);

  if (!album || album.userID !== userID) {
    throw ServiceError.notFound(`No album with id ${albumID} exists`, { albumID });
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


// 1 user can't have 2 albums with same name -> no unique DB-table-row constraint on albumName -> 2 different users may have an album with the same name
const create = async ({ albumName, creationDate, userID }) => {

  const existingAlbum = await albumRepository.findByNameAndUserID(albumName, userID);
  
  if(existingAlbum){
    throw ServiceError.validationFailed(`An album with name ${albumName} already exists`, { albumName });
  }
  const formattedDate = formatIsoString(creationDate.toISOString());

  try {
    const id = await albumRepository.create({ albumName, formattedDate, userID });
    return getById(id, userID);

  } catch (error) {
    throw handleDBError(error);
  }
};

const updateAlbumName = async (albumID, userID, newName) => {
  
  // nieuw gekozen naam mag nog niet bestaan (uniek voor deze user):
  const existingAlbum = await albumRepository.findByNameAndUserID(newName, userID);

  if(existingAlbum){
    throw ServiceError.validationFailed(`An album with name ${newName} already exists`, { newName });
  }

  // update albumName
  try {
    await albumRepository.updateById(albumID, newName);
    return getById(albumID, userID);
  } catch (error) {
    throw handleDBError(error);
  }
}

const deleteById = async (albumID) => {
  try {
    const deleted = await albumRepository.deleteById(albumID);

    if (!deleted) {
      throw ServiceError.notFound(`No album with id ${albumID} exists`, { albumID });
    }  
  } catch (error) {
    throw handleDBError(error);
  }
};

const addFotoToAlbum = async (albumID, fotoID) => {
  const albumFoto = await albumFotoService.create(albumID, fotoID);
  return albumFoto;
}

const removeFotoFromAlbum = async (albumID, fotoID) => {
  await albumFotoService.removeFotoFromAlbum(albumID, fotoID); // errors handled in albumFotoService
}

const createAndAddFoto = async ({ albumName, fotoID, creationDate, userID }) => {

  const existingAlbum = await albumRepository.findByNameAndUserID(albumName, userID);
  if(existingAlbum){
    throw ServiceError.validationFailed(`An album with name ${albumName} already exists`, { albumName });
  }
  
  const formattedDate = formatIsoString(creationDate.toISOString());

  //eerst album aanmaken (can throw duplicate DB-entry eror)(outdated: see handleDBError):
  const albumID = await albumRepository.create({ albumName, formattedDate, userID });

  //foto toevoegen -> new record in tussentabel
  const newAlbum = await getById(albumID, userID);
  const albumFoto = await albumFotoService.create(albumID, fotoID); // not sure if this needs returning...

  return newAlbum;
}

// query table-joins in repo laag om alle fotos op albumID terug te geven mbv tussentabel
const getAlbumImages = async(albumID) => {
  const items = await albumRepository.getImagesByAlbumId(albumID);
  return {
    items,
    count: items.length,
  };
}

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
  getAllByUserId,
  create,
  addFotoToAlbum,
  createAndAddFoto,
  getAlbumImages,
  deleteById,
  removeFotoFromAlbum,
  updateAlbumName,
};