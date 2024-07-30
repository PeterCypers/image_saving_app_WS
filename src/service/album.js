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


// you can not create 2 albums with the same name -> handleDB error working
const create = async ({ albumName, creationDate, userID }) => {
  const formattedDate = formatIsoString(creationDate.toISOString());

  try {
    const id = await albumRepository.create({ albumName, formattedDate, userID });
    return getById(id, userID);

  } catch (error) {
    throw handleDBError(error);
  }
};

const addFotoToAlbum = async (albumID, fotoID) => {
  const albumFoto = await albumFotoService.create(albumID, fotoID);
  return albumFoto;
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
};