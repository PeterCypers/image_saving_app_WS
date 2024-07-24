const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data');

//TODO low priority: many methods need adjusting to work with my db-structure and naming
// userID, email, passwordHash, roles

/**
 * Get all users.
 */
const findAll = () => {
  return getKnex()(tables.users).select().orderBy('userID', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.users).count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {number} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.users).where('userID', id).first();
};

/**
 * Find a user with the given email.
 *
 * @param {string} email - The email to search for.
 */
const findByEmail = (email) => {
  return getKnex()(tables.users).where('email', email).first();
};

/**
 * Create a new user with the given `name`.
 *
 * @param {object} user - User to create.
 * @param {string} user.name - Name of the user.
 */
const create = async ({ email, hashedPassword, roles }) => {
  try {
    const [id] = await getKnex()(tables.users).insert({
      email,
      passwordHash: hashedPassword,
      roles: JSON.stringify(roles),
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
 * Update a user with the given `id`.
 *
 * @param {number} id - Id of the user to update.
 * @param {object} user - User to save.
 * @param {string} user.email - Email of the user.
 */
const updateById = async (id, { email }) => {
  try {
    await getKnex()(tables.users)
      .update({
        email
      })
      .where('userID', id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Update a user with the given `id`.
 *
 * @param {number} id - Id of the user to delete.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.users).delete().where('userID', id);
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
  findCount,
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
};
