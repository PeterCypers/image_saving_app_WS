const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');
//TODO: pas alle functies aan om op mijn database te werken
/**
 * Find all fotos.
 */
const findAll = (userID) => {
  getLogger().info('Querying fotos by User id', { userID });
  return getKnex()(tables.foto).where('userID', userID).orderBy('dateUploaded', 'DESC');
};

/**
 * Find a foto with the given `id`.
 * @param {number} fotoID - Id of the foto to find.
 */
const findById = (fotoID) => {
  getLogger().info('Querying foto by id', { fotoID });
  return getKnex()(tables.foto).where('fotoID', fotoID).first();
};

/**
 * TODO:
 * Add method find by dateUploaded?
 */

/**
 * Calculate the total number of fotos.
 *
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.foto).count();

  return count['count(*)'];
};

const findByLocation = async (location) => {
  try {
    const result = await getKnex()(tables.foto).where({ location }).first();
    return result;
  } catch (error) {
    getLogger().error('Error in findByLocation', { error });
    throw error;
  }
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
const create = async ({ location, formattedDate, userID }) => {
  try {
    /*const [fotoID] = */await getKnex()(tables.foto).insert({
      location,
      dateUploaded: formattedDate,
      userID,
    });

    //return fotoID;
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
  findCount,
  create,
  deleteById,
  findByLocation,
};
