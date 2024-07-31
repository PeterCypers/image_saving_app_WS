const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

//TODO work away unnecesary async-await-> low prio
const findAlbumFoto = async (albumID, fotoID) => {
  const albumFoto = await getKnex()(tables.fotoalbum_foto)
  .where({fotoID, albumID}).first();

  return albumFoto;
}

const findAllByAlbumID = async (albumID) => {
  getLogger().info('Querying fotos by album id', { albumID });
  const albumFotos = await getKnex()(tables.fotoalbum_foto).where('albumID', albumID);
  return albumFotos;
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
  findAlbumFoto,
  findAllByAlbumID
}