const albumFotoRepository = require('../repository/album_foto');
const ServiceError = require('../core/serviceError');

//controle methode returns false || obj
const getByAlbumIdFotoId = async(albumID, fotoID) => {
  const albumFoto = await albumFotoRepository.findAlbumFoto(albumID, fotoID);
  return albumFoto;
}

const create = async(albumID, fotoID) => {
  const existingFoto = await getByAlbumIdFotoId(albumID, fotoID);

  if (existingFoto) {
    throw ServiceError.validationFailed(`There is already a photo with id ${fotoID}.`, { fotoID });
  }
  await albumFotoRepository.create(albumID, fotoID);
  return await getByAlbumIdFotoId(albumID, fotoID);
}

const removeFotoFromAlbum = async(albumID, fotoID) => {
  try {
    const deleted = await albumFotoRepository.deleteByAlbumIdFotoId(albumID, fotoID);

    if (!deleted) {
      throw ServiceError.notFound(`No album-foto with albumID ${albumID}, fotoID ${fotoID} exists`, { albumID, fotoID });
    }  
  } catch (error) {
    throw handleDBError(error);
  }
}

module.exports = {
  getByAlbumIdFotoId,
  create,
  removeFotoFromAlbum,
}