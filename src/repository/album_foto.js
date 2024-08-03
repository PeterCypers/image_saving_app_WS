const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

const findAlbumFoto = async (albumID, fotoID) => {
  const albumFoto = await getKnex()(tables.fotoalbum_foto)
  .where({fotoID, albumID}).first();

  return albumFoto;
}

// niet meer gebruikt: returns alle records tussentabel op albumID -> joins nodig, zie albumservice & repository
const findAllByAlbumID = async (albumID) => {
  getLogger().info('Querying fotos by album id', { albumID });
  const albumFotos = await getKnex()(tables.fotoalbum_foto).where('albumID', albumID);
  return albumFotos;
}

const create = async (albumID, fotoID) => {
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

// verwijder een foto uit de album -> record in tussentabel zoeken en verwijderen
const deleteByAlbumIdFotoId = async(albumID, fotoID) => {
  try {
    const rowsAffected = await getKnex()(tables.fotoalbum_foto)
      .delete()
      .where('albumID', albumID)
      .andWhere('fotoID', fotoID);

    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteByAlbumIdFotoId', {
      error,
    });
    throw error;
  }
}

module.exports = {
  create,
  findAlbumFoto,
  //findAllByAlbumID,
  deleteByAlbumIdFotoId,
}