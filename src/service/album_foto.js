const albumFotoRepository = require('../repository/album_foto');
const ServiceError = require('../core/serviceError');

//controle methode returns false || obj
const getByAlbumIdFotoId = async(albumID, fotoID) => {
  const albumFoto = await albumFotoRepository.getAlbumFoto(albumID, fotoID);
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

module.exports = {
  getByAlbumIdFotoId,
  create,
}