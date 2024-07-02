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
//TODO: FormData & filesize problem
const createFoto = async (ctx) => {
  const logger = getLogger();
  logger.error(JSON.stringify(ctx.request.body));
  // const foto = await fotoService.create({
  //   ...ctx.request.body,
  //   rating: Date(ctx.request.body.dateUploaded),
  // });
  // ctx.status = 201;
  // ctx.body = place;
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
    const uploadsDirectory = path.join(__dirname, '..', 'uploads');

    const userDirectory = path.join(uploadsDirectory, userID.toString());

    // Ensure the user-specific directory exists; create it if necessary
    if (!fs.existsSync(userDirectory)){
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    // Construct the target path within the user-specific directory
    const targetPath = path.join(userDirectory, originalName);

    // Move the file to the target path
    fs.renameSync(tempFilePath, targetPath);

    // Log the details or save metadata to the database
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
  router.post('/', createFoto);
  router.post('/save/', saveFoto);
  router.get('/:id', getAllByUserId)
  router.get('/:userID/:fotoID', getFotoById); //might not get used -> curious if works
//   router.put('/:id', updateFoto);
  router.delete('/:id', deleteFoto);

  app.use(router.routes()).use(router.allowedMethods());
};
