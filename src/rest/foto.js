const Router = require('@koa/router');
const Joi = require('joi');
const validate = require('../core/validation');
const fotoService = require('../service/foto');
const { getLogger } = require('../core/logging'); //testing
const { requireAuthentication /*, makeRequireRole */} = require('../core/auth');

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


// no longer to be used, or possibly used by admin
const getAllFotos = async (ctx) => {
  const { userID } = ctx.state.session;
  ctx.body = await fotoService.getAll(userID);
};
getAllFotos.validationScheme = null;

const getFotoById = async (ctx) => {
  const { userID } = ctx.state.session;
  ctx.body = await fotoService.getById(Number(ctx.params.fotoID), userID);
};
getFotoById.validationScheme = {
  params: Joi.object({
    fotoID: Joi.number().integer().positive(),
  }),
}

const deleteFoto = async (ctx) => {
  await fotoService.deleteById(ctx.params.id);
  ctx.status = 204;
};


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

    // Define the target path where the file will be saved
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

    //TODO: might change when website goes online
    // Construct the complete URL
    const fileUrl = `http://localhost:9000${relativePath}`;

    // Save metadata to the database
    const existingFoto = await fotoService.create({
      location: fileUrl,
      dateUploaded: dateUploaded || new Date().toISOString(),
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
saveFoto.validationScheme = {
  body: {
    userID: Joi.number().integer().positive(),
    dateUploaded: Joi.date().iso()
  },
};

/**
 * Install foto routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/fotos',
  });

  // all fotos endpoints require a logged in user
  router.use(requireAuthentication);

  router.get('/', validate(getAllFotos.validationScheme), getAllFotos);
  /**
   * unique request handling the server-side storage of a fysical photo-file and metadata persistance
   * some validation handled in front-end component: bad file-type -> request won't get sent
   */
  router.post('/save', validate(saveFoto.validationScheme), saveFoto);
  router.get('/:id', validate(getFotoById.validationScheme), getFotoById); //TODO (1) not by userID, by fotoID
//   router.put('/:id', updateFoto); // probably not used
  router.delete('/:id', deleteFoto); //TODO

  app.use(router.routes()).use(router.allowedMethods());
};
