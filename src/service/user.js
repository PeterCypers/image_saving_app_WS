const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
// const { hashPassword } = require('../utils/hashPassword'); // code door blackbox gegenereerd
// const { generateToken } = require('../core/token'); // code door blackbox gegenereerd
const { hashPassword, verifyPassword } = require('../core/password');
const Role = require('../core/roles');
const { generateJWT, verifyJWT } = require('../core/jwt');

// alle params van user teruggeven zonder paswoord
const makeExposedUser = ({ userID, email, roles }) => ({userID, email, roles})

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    token,
    user: makeExposedUser(user) // user bevat de passwoord, dit wil je niet zomaar teruggeven -> proxy
  }
}

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw ServiceError.unauthorized('The given email or password do not match'); // eigenlijk bestaat de gebruiker niet maar vage omschrijving tegen mogelijke hackers
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    throw ServiceError.unauthorized('The given email or password do not match'); // gebruiker bestaat, maar paswoord is verkeerd
  }

  return await makeLoginData(user);
}

/**
 * Get all users.
 */
const getAll = async () => {
  const items = await userRepository.findAll();
  return {
    items: items.map(makeExposedUser),
    count: items.length,
  };
};

/**
 * Get the user with the given id.
 *
 * @param {number} id - Id of the user to get.
 */
const getById = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }

  return makeExposedUser(user);
};

/**
 * Register a user.
 *
 * @param {object} user - User to save.
 * @param {string} [user.email] - Email of the user.
 */
const register = async ({ email, password/*, roles */}) => { //zie les 9 40:30
  try {
    const hashedPassword = await hashPassword(password);

    const userId = await userRepository.create({ email, hashedPassword, roles: [Role.USER] });
    const user = await userRepository.findById(userId);
    return await makeLoginData(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Update an existing user.
 *
 * @param {number} id - Id of the user to update.
 * @param {object} user - User to save.
 * @param {string} [user.email] - Email of the user.
 */
const updateById = async (id, { email }) => {
  try {
    await userRepository.updateById(id, { email });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Delete an existing user.
 *
 * @param {number} id - Id of the user to delete.
 */
const deleteById = async (id) => {
  try {
    const deleted = await userRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
  login,
};
