const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Find all places.
 */
const findAll = () => {
  getLogger().info('Finding all places');
  return getKnex()(tables.place).select().orderBy('name', 'ASC');
};

/**
 * Find a place with the given `name`.
 *
 * @param {string} name - Name to look for.
 */
const findByName = (name) => {
  return getKnex()(tables.place).where('name', name).first();
};

/**
 * Find a place with the given `id`.
 *
 * @param {number} id - Id of the place to find.
 */
const findById = (id) => {
  getLogger().info('Querying transaction by id', { id });
  return getKnex()(tables.place).where('id', id).first();
};

/**
 * Create a new place with the given `name` and `rating`.
 *
 * @param {object} place - Place to create.
 * @param {string} place.name - Name of the place.
 * @param {number} [place.rating] - Rating given to the place (1 to 5).
 *
 * @returns {Promise<number>} Created place's id
 */
const create = async ({ name, rating }) => {
  try {
    const [id] = await getKnex()(tables.place).insert({
      name,
      rating,
    });

    return id;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing place with the given `name` and `rating`.
 *
 * @param {number} id - Id of the place to update.
 * @param {object} place - Place to create.
 * @param {string} [place.name] - Name of the place.
 * @param {number} [place.rating] - Rating given to the place (1 to 5).
 *
 * @returns {Promise<number>} Place's id
 */
const updateById = async (id, { name, rating }) => {
  try {
    await getKnex()(tables.place)
      .update({
        name,
        rating,
      })
      .where('id', id);

    return id;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a place.
 *
 * @param {number} id - Id of the place to delete.
 *
 * @returns {Promise<boolean>} Whether the place was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.place).delete().where('id', id);

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
  findByName,
  create,
  updateById,
  deleteById,
};
