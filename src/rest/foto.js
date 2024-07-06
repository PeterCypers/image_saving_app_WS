const Router = require('@koa/router');
const fotoService = require('../service/foto');
const { getLogger } = require('../core/logging'); //testing

/**
 * file opslaan: (met koa-body ipv multer -> koa-body != koa-bodyparser)
 * 
 * https://www.npmjs.com/package/koa-body
 * https://github.com/koajs/koa/wiki#body-parsing
 */

// verplaatst naar core/installMiddlewares
// const koaBody = require('koa-body');
// app.use(koaBody({ multipart: true }));

const fs = require('fs');
const path = require('path');



const getAllFotos = async (ctx) => {
  ctx.body = await fotoService.getAll();
};

const getAllByUserId = async (ctx) => {
  ctx.body = await fotoService.getAllByUserId(Number(ctx.params.id));
}

const getFotoById = async (ctx) => {
  ctx.body = await fotoService.getById(Number(ctx.params.userID),Number(ctx.params.fotoID));
};

const deleteFoto = async (ctx) => {
  await fotoService.deleteById(ctx.params.id);
  ctx.status = 204;
};

// TODO: move to service layer
// file Object keys: _events,_eventsCount,_maxListeners,lastModifiedDate,filepath,newFilename,originalFilename,mimetype,hashAlgorithm,size,_writeStream,hash
const saveFoto = async (ctx) => {
  const logger = getLogger();
  
  // Access the uploaded file and other form data
  const { userID, dateUploaded } = ctx.request.body;
  const fotoFile = ctx.request.files.fotoFile; // Access the uploaded file
  //Debugging
  /*
  logger.info(JSON.stringify(ctx.request.body));
  logger.info(`${fotoFile}`);
  logger.info(`${dateUploaded} ${typeof dateUploaded}`);
  logger.info(`${typeof fotoFile}`);
  logger.info(`${Object.keys(fotoFile)}`);
  logger.info(`${fotoFile.originalFilename}`);
  logger.info(`${fotoFile.filepath}`);
  logger.info(`${fotoFile.size}`);
  logger.info(path.join(__dirname, '..', 'uploads'));
  */

  // Check if fotoFile is present
  if (!fotoFile) {
    ctx.status = 400;
    ctx.body = { error: 'No file uploaded' };
    return;
  }


  try {

    // Get the temporary file path and original file name
    const { filepath: tempFilePath, originalFilename: originalName } = fotoFile;

    // Define the target path where the file will be saved (adjust path as needed)
    const uploadsDirectory = path.join(__dirname, '..', '..', 'public', 'uploads');

    const userDirectory = path.join(uploadsDirectory, 'user' + userID.toString());

    // Ensure the user-specific directory exists; create it if necessary
    if (!fs.existsSync(userDirectory)){
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    // Construct the target path within the user-specific directory
    const targetPath = path.join(userDirectory, originalName);

    // Move the file to the target path
    fs.renameSync(tempFilePath, targetPath);

    // getting the difference between 2 paths:(ter info)
    // const relativePath = path.relative(path.join(__dirname, '..', '..', 'public'), targetPath);

    // Convert absolute path to URL-like path
    const relativePath = targetPath.replace(uploadsDirectory, '').replace(/\\/g, '/');

    // Construct the complete URL
    const fileUrl = `http://localhost:9000${relativePath}`;

    // TODO: handle using the service properly -> try to save a new foto in DB
    // Save metadata to the database
    const existingFoto = await fotoService.create({
      location: fileUrl,
      dateUploaded: formatIsoString(dateUploaded) || formatIsoString(new Date().toISOString()),
      userID: userID
    });

    if (existingFoto) {
      logger.info(`Duplicate file detected: ${originalName}`);
      ctx.status = 409; // Conflict status code
      ctx.body = { message: 'File already exists' };
      return;
    }

    // Log the details
    logger.info(`File uploaded successfully: ${originalName}`);
    logger.info(`User ID: ${userID}`);
    logger.info(`Date Uploaded: ${dateUploaded}`);

    ctx.status = 201;
    ctx.body = { message: 'File uploaded successfully' };
  } catch (err) {
    logger.error('Error saving file:', err);
    ctx.status = 500;
    ctx.body = { error: 'Error uploading file' };
  }
}

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
 * Install foto routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/fotos',
  });

  router.get('/', getAllFotos); //getAll zal niet meer gebeuren -> allByUserID
  router.post('/save/', saveFoto);
  router.get('/:id', getAllByUserId)
  router.get('/:userID/:fotoID', getFotoById); //might not get used -> curious if works
//   router.put('/:id', updateFoto);
  router.delete('/:id', deleteFoto);

  app.use(router.routes()).use(router.allowedMethods());
};
