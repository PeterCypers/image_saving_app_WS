const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

// zal nooit gebruikt worden
const findAll = () => {
  getLogger().info('Finding all albums');
  return getKnex()(tables.fotoalbum).select().orderBy('dateUploaded', 'DESC');
};

const findById = (id) => {
  getLogger().info('Querying album by id', { id });
  return getKnex()(tables.fotoalbum).where('albumID', id).first();
};

const findAllByUserId = (id) => {
  getLogger().info('Querying albums by User Id', { id });
  return getKnex()(tables.fotoalbum).where('userID', id);
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
const create = async ({ albumName, creationDate, userID }) => {
  try {
    const [albumID] = await getKnex()(tables.fotoalbum).insert({
      albumName,
      creationDate,
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
  findAllByUserId,
  findById,
  create,
}