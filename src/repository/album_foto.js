const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

const getAlbumFoto = async (albumID, fotoID) => {
  const albumFoto = await getKnex()(tables.fotoalbum_foto)
  .where({fotoID, albumID}).first();

  return albumFoto;
}

const create = async(albumID, fotoID) => {
  try{
    await getKnex()(tables.fotoalbum_foto).insert({
      fotoID,
      albumID,
    });

    // const query = getKnex()(tables.fotoalbum_foto).insert({
    //   fotoID,
    //   albumID,
    // });
    // console.log(query.toString()); // Log the generated SQL query for debugging
    // await query;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
}

module.exports = {
  create,
  getAlbumFoto
}