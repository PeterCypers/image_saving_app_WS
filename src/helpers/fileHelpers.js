const fs = require('fs');
const path = require('path');
const { getLogger } = require('../core/logging');
const config = require('config');


/**
 * Saves an uploaded file to the specified user directory.
 * 
 * @param {Object} fotoFile - The uploaded file object.
 * @param {number} userID - The ID of the user uploading the file.
 * @param {string} baseDir - The base directory where files are stored.
 * @returns {string} - The URL of the saved file.
 */
const saveFileToSystem = (fotoFile, userID, baseDir) => {
  const logger = getLogger();

  try {
    // Get the temporary file path and original file name
    const { filepath: tempFilePath, originalFilename: originalName } = fotoFile;

    // Define the target path where the file will be saved
    const userDirectory = path.join(baseDir, 'user' + userID.toString());

    // Ensure the user-specific directory exists; create it if necessary
    if (!fs.existsSync(userDirectory)) {
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    // Construct the target path within the user-specific directory
    const targetPath = path.join(userDirectory, originalName);

    // Move the file to the target path
    fs.renameSync(tempFilePath, targetPath);

    // getting the difference between 2 paths:(ter info)
    // const relativePath = path.relative(path.join(__dirname, '..', '..', 'public'), targetPath);

    // Convert absolute path to URL-like path
    const relativePath = targetPath.replace(baseDir, '').replace(/\\/g, '/');

    //TODO: might change when website goes online
    // Construct the complete URL
    const port = config.get('port');
    const fileUrl = `http://localhost:${port}${relativePath}`;

    logger.info(`File saved successfully: ${originalName}`);
    logger.info(`User ID: ${userID}`);

    return fileUrl;
  } catch (err) {
    logger.error('Error saving file:', err);
    throw err; // Re-throw to handle in the caller if necessary
  }
};



/**
 * Deletes a file from the filesystem.
 * 
 * @param {string} fileUrl - The URL of the file to delete.
 * @param {string} baseDir - The base directory where files are stored.
 */
const deleteFileFromSystem = (fileUrl, baseDir) => {
  const logger = getLogger();
  try {
    // Construct the file path from the URL
    const port = config.get('port');
    const filePath = path.join(baseDir, fileUrl.replace(new RegExp(`^https?:\/\/localhost:${port}`), ''));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`File deleted successfully: ${filePath}`);
    } else {
      logger.error(`File not found: ${filePath}`);
    }
  } catch (err) {
    logger.error('Error deleting file:', err);
    throw err; // Re-throw to handle in the caller if necessary
  }
};


module.exports = {
  saveFileToSystem,
  deleteFileFromSystem
};