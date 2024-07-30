const fotoRepository = require('../repository/foto');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');
/**  findAll,
  findById,
  create,
  deleteById, */
const getAll = async (userID) => {
  const items = await fotoRepository.findAll(userID);
  return {
    items,
    count: items.length,
  };
};

const getById = async (fotoID, userID) => {
  const foto = await fotoRepository.findById(fotoID);

  if (!foto || foto.userID !== userID) {
    throw ServiceError.notFound(`No foto with id ${fotoID} exists`, { fotoID });
  }

  return foto;
};

const create = async ({ location, dateUploaded, userID }) => {
  const formattedDate = formatIsoString(dateUploaded/*.toISOString()*/); // dateUploaded is already in ISOString format
  const existingFoto = await fotoRepository.findByLocation(location);
  if (existingFoto) {
    return existingFoto; // Return the existing entry if it already exists
  }
  /*const id =*/ //await fotoRepository.create({ location, dateUploaded, userID });
  //return getById(id);
  await fotoRepository.create({ location, formattedDate, userID });
};

// TODO: rework to getting 2 parameters
const deleteById = async (id) => {
  try{
  const deleted = await fotoRepository.deleteById(id);
    
  if (!deleted) {
      throw ServiceError.notFound(`No foto with id ${id} exists`, { id });
    }

  }catch (error) {
    throw handleDBError(error);
  }
};
/*
  try {
    const deleted = await transactionRepository.deleteById(id, userId);

    if (!deleted) {
      throw ServiceError.notFound(`No transaction with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};
*/
function formatIsoString(isoString) {
  let date = new Date(isoString);

  // Format the date and time
  let formattedDate = date.getFullYear() + '-' +
                      ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                      ('0' + date.getDate()).slice(-2) + ' ' +
                      ('0' + date.getHours()).slice(-2) + ':' +
                      ('0' + date.getMinutes()).slice(-2) + ':' +
                      ('0' + date.getSeconds()).slice(-2);

  return formattedDate;
}

/**
 * Deletes a file from the filesystem.
 * 
 * @param {string} fileUrl - The URL of the file to delete.
 * @param {string} baseDir - The base directory where files are stored.
 */
const deleteFileFromSystem = (fileUrl, baseDir) => {
  try {
    // Construct the file path from the URL
    const filePath = path.join(baseDir, fileUrl.replace(/^http:\/\/localhost:9000/, ''));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.info(`File deleted successfully: ${filePath}`);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err; // Re-throw to handle in the caller if necessary
  }
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  deleteFileFromSystem,
};
