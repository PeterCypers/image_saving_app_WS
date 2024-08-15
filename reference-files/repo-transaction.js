const { getLogger } = require('../src/core/logging');
const { tables, getKnex } = require('../src/data/index');

const formatTransaction = ({
  place_id,
  place_name,
  user_id,
  user_name,
  ...transaction
}) => {
  return {
    ...transaction,
    user: {
      id: user_id,
      name: user_name,
    },
    place: {
      id: place_id,
      name: place_name,
    },
  };
};

const SELECT_COLUMNS = [
  `${tables.transaction}.id`,
  'amount',
  'date',
  `${tables.place}.id as place_id`,
  `${tables.place}.name as place_name`,
  `${tables.user}.id as user_id`,
  `${tables.user}.name as user_name`,
];

/**
 * Get all transactions
 *
 */
const findAll = async (userId) => {
  const transactions = await getKnex()(tables.transaction)
    .join(
      tables.place,
      `${tables.transaction}.place_id`,
      '=',
      `${tables.place}.id`
    )
    .join(
      tables.user,
      `${tables.transaction}.user_id`,
      '=',
      `${tables.user}.id`
    )
    .where(`${tables.transaction}.user_id`, userId)
    .select(SELECT_COLUMNS)
    .orderBy('date', 'ASC');

  return transactions.map(formatTransaction);
};

/**
 * Calculate the total number of transactions.
 *
 */
const findCount = async (userId) => {
  const [count] = await getKnex()(tables.transaction)
  .count()
  .where(`${tables.transaction}.user_id`, userId);

  return count['count(*)'];
};

/**
 * Find a transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to find.
 */
const findById = async (id) => {
  const transaction = await getKnex()(tables.transaction)
    .join(
      tables.place,
      `${tables.transaction}.place_id`,
      '=',
      `${tables.place}.id`
    )
    .join(
      tables.user,
      `${tables.transaction}.user_id`,
      '=',
      `${tables.user}.id`
    )
    .where(`${tables.transaction}.id`, id)
    .first(SELECT_COLUMNS);

  return transaction && formatTransaction(transaction);
};

/**
 * Create a new transaction.
 *
 * @param {object} transaction - The transaction to create.
 * @param {number} transaction.amount - Amount deposited/withdrawn.
 * @param {Date} transaction.date - Date of the transaction.
 * @param {number} transaction.placeId - Id of the place the transaction happened.
 * @param {number} transaction.userId - Id of the user who did the transaction.
 *
 * @returns {Promise<number>} Created transaction's id
 */
const create = async ({ amount, date, placeId, userId }) => {
  try {
    const [id] = await getKnex()(tables.transaction).insert({
      amount,
      date,
      place_id: placeId,
      user_id: userId,
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
 * Update an existing transaction.
 *
 * @param {number} id - Id of the transaction to update.
 * @param {object} transaction - The transaction data to save.
 * @param {number} [transaction.amount] - Amount deposited/withdrawn.
 * @param {Date} [transaction.date] - Date of the transaction.
 * @param {number} [transaction.placeId] - Id of the place the transaction happened.
 * @param {number} [transaction.userId] - Id of the user who did the transaction.
 *
 * @returns {Promise<number>} Transaction's id
 */
const updateById = async (id, { amount, date, placeId, userId }) => {
  try {
    await getKnex()(tables.transaction)
      .update({
        amount,
        date,
        place_id: placeId,
        user_id: userId,
      })
      .where(`${tables.transaction}.id`, id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to delete.
 * @param {number} userId - Id of the user deleting the transaction.
 *
 * @returns {Promise<boolean>} Whether the transaction was deleted.
 */
const deleteById = async (id, userId) => {
  try {
    const rowsAffected = await getKnex()(tables.transaction)
      .where(`${tables.transaction}.id`, id)
      .where(`${tables.transaction}.user_id`, userId)
      .delete();

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
  create,
  updateById,
  deleteById,
};
