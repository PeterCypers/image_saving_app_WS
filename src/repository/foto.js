const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');
//TODO: pas alle functies aan om op mijn database te werken
/**
 * Find all fotos.
 */
const findAll = () => {
  getLogger().info('Finding all fotos');
  return getKnex()(tables.foto).select().orderBy('dateUploaded', 'DESC');
};

/**
 * TODO:
 * Add method find by dateUploaded?
 */

/**
 * Find a place with the given `id`.
 *
 * @param {number} id - Id of the place to find.
 */
const findById = (id) => {
  getLogger().info('Querying fotos by id', { id });
  return getKnex()(tables.foto).where('fotoID', id).first();
};

/**
 * Create a new foto with the given `location` and `dateUploaded` and `userID`.
 *
 * fotoID: auto-increment
 * @param {object} foto - foto to create.
 * @param {string} foto.location - url location of the stored foto.
 * @param {date} foto.dateUploaded - date that the foto was uploaded
 * @param {number} foto.userID - Id of the current user
 *
 * @returns {Promise<number>} Created foto's id
 */
const create = async ({ location, dateUploaded, userID }) => {
  try {
    const [fotoID] = await getKnex()(tables.foto).insert({
      location,
      dateUploaded,
      userID,
    });

    return fotoID;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a foto.
 *
 * @param {number} id - Id of the foto to delete.
 *
 * @returns {Promise<boolean>} Whether the foto was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.foto).delete().where('fotoID', id);

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
  findById,
  create,
  deleteById,
};
