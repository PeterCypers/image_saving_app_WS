const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

// get all albums will always give albums by userID
// standard order by creation date oldest to newest
const findAll = async (userID) => {
  try {
    getLogger().info('Querying albums by User Id', { userID });
    
    return await getKnex()(tables.fotoalbum)
      .where('userID', userID)
      .orderBy('creationDate');
  } catch (error) {
    getLogger().error('Error in findAll', { error });
    throw error;
  }
};

const findById = async (albumID) => {
  try {
    getLogger().info('Querying album by id', { albumID });

    return await getKnex()(tables.fotoalbum)
      .where('albumID', albumID)
      .first();
  } catch (error) {
    getLogger().error('Error in findById', { error });
    throw error;
  }

};

// rule: album name unique by user
const findByNameAndUserID = async (albumName, userID) => {
  try {
    getLogger().info('Querying album by name and userID', { albumName, userID });

    return await getKnex()(tables.fotoalbum)
      .where('albumName', albumName)
      .andWhere('userID', userID)
      .first();
  } catch (error) {
    getLogger().error('Error in findByNameAndUserID', { error });
    throw error;
  }

}

// hoort mogelijks thuis in fotos pad?
const getImagesByAlbumId = async (albumID) => {
  try {
    getLogger().info('Querying all fotos by albumID joining fotoalbum_foto with foto', { albumID });

    return await getKnex()(tables.fotoalbum_foto)
      .join(tables.foto, `${tables.fotoalbum_foto}.fotoID`, '=', `${tables.foto}.fotoID`)
      .where(`${tables.fotoalbum_foto}.albumID`, albumID)
      .select(
        `${tables.foto}.fotoID`,
        `${tables.foto}.location`,
        `${tables.foto}.dateUploaded`
      )
      .orderBy(`${tables.foto}.dateUploaded`, 'asc');
  } catch (error) {
    getLogger().error('Error in getImagesByAlbumId', { error });
    throw error;
  }
};

/**
 * Create a new foto with the given `albumName` and `creationDate` and `userID`.
 *albumName: 'NotEmptyUniqueString', creationDate: '2023-10-21 00:00:00', userID: 1
 * albumID: auto-increment
 * @param {object} album - album to create.
 * @param {string} album.albumName - unique not empty name max length: 25.
 * @param {string} album.creationDate - album creationdate set & formatted in the rest-layer.
 * @param {number} album.userID - Id of the current user
 *
 * @returns {Promise<number>} Created album's id
 */
const create = async ({ albumName, formattedDate, userID }) => {
  try {
    const [albumID] = await getKnex()(tables.fotoalbum).insert({
      albumName,
      creationDate: formattedDate,
      userID,
    });

    return albumID;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Delete an album.
 *
 * @param {number} id - Id of the album to delete.
 *
 * @returns {Promise<boolean>} Whether the album was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.fotoalbum).delete().where('albumID', id);

    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

const updateById = async (albumID, newName) => {
  try {
    await getKnex()(tables.fotoalbum)
      .update({albumName: newName})
      .where('albumID', albumID);

    return albumID;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAll,
  //findAllByUserId,
  findById,
  create,
  findByNameAndUserID,
  getImagesByAlbumId, 
  deleteById,
  updateById,
}