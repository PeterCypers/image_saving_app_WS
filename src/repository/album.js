const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

// get all albums will always give albums by userID
// standard order by creation date oldest to newest
const findAll = (userID) => {
  getLogger().info('Querying albums by User Id', { userID });
  return getKnex()(tables.fotoalbum).where('userID', userID).orderBy('creationDate');
};

const findById = (albumID) => {
  getLogger().info('Querying album by id', { albumID });
  return getKnex()(tables.fotoalbum).where('albumID', albumID).first();
};

// rule: album name unique by user
const findByNameAndUserID = (albumName, userID) => {
  getLogger().info('Querying album by name and userID', { albumName, userID });
  return getKnex()(tables.fotoalbum).where('albumName', albumName).andWhere('userID', userID).first();
}

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


module.exports = {
  findAll,
  //findAllByUserId,
  findById,
  create,
  findByNameAndUserID,
}