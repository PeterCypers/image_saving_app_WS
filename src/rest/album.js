const Router = require('@koa/router');
const Joi = require('joi');
const validate = require('../core/validation');
const albumService = require('../service/album');
const { getLogger } = require('../core/logging'); //testing
const { requireAuthentication /*, makeRequireRole */} = require('../core/auth');

// never used
const getAllAlbums = async (ctx) => {}

const getAllByUserId = async (ctx) => {
  ctx.body = await albumService.getAllByUserId(Number(ctx.params.userID));
}
getAllByUserId.validationScheme = {
  params: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
};

//zal nooit gebruikt worden, enkel intern in servicelaag(create album)
//ook probleem met 2 parameters in get by id
const getAlbumById = async (ctx) => {
  ctx.body = await albumService.getById(Number(ctx.params.userID),Number(ctx.params.albumID));
}

// TODO:
const deleteAlbum = async (ctx) => {
  await fotoService.deleteById(ctx.params.id);
  ctx.status = 204;
};

//spread operator verzamelt alle properties en stelt ze gelijk aan zichzelf ~ zie obj.destru.
//enkel de values die moeten aangepast worden (casting from strings to ...) aanpassen
//datum moet niet meegegeven worden aan front-end, zal hier gemaakt worden
/**
 * 
 * @param {*} ctx albumname & userID
 */
const createAlbum = async (ctx) => {
  const logger = getLogger();
  logger.error(JSON.stringify(ctx.request.body));

  const newAlbum = await albumService.create({
    ...ctx.request.body, //er schiet enkel nog <albumName> over in de body... maar die mag als string blijven
    creationDate: formatIsoString(new Date().toISOString()),
    userID: Number(ctx.request.body.userID),
  });

  ctx.status = 201;
  ctx.body = newAlbum;
}
createAlbum.validationScheme = {
  body: {
    albumName: Joi.string().max(25),
    userID: Joi.number().integer().positive(),
  },
};


/**
 * 
 * @param {*} ctx body: albumName, imageID | params: userID
 */
const createAlbumAndAddFoto = async (ctx) => {
  const newAlbum = await albumService.createAndAddFoto({
    ...ctx.request.body, // albumName, imageID
    creationDate: formatIsoString(new Date().toISOString()),
    userID: Number(ctx.params.userID),
  });

  ctx.status = 201;
  ctx.body = newAlbum;
}
createAlbumAndAddFoto.validationScheme = {
  body: {
    albumName: Joi.string().max(25),
    imageID: Joi.number().integer().positive(),
  },
  params: Joi.object({
    userID: Joi.number().integer().positive(),
  }),
};

// TODO:
/**
 * body: imageID, userID
 * 
 * @param {*} ctx albumID
 * 
 * 
 */
const addFotoToAlbum = async (ctx) => {
  /*const updatedAlbum =*/ await albumService.update(Number(ctx.params.id), {
    ...ctx.request.body,
    creationDate: formatIsoString(new Date().toISOString()),
    });
    ctx.status = 204;
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
 * DB format: albumID: 1 , albumName: 'NotEmptyUniqueString', creationDate: '2023-10-21 00:00:00', userID: 1
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/albums',
  });

  //TODO nadat login werkt -> requireAuthentication overal bij zetten (zie rest/user.js) -> alle features eisen user = logged in

  router.get('/', getAllAlbums); //wordt niet gebruikt
  router.post('/', validate(createAlbum.validationScheme), createAlbum);
  router.post('/:userID', createAlbumAndAddFoto);
  router.get('/:userID', validate(getAllByUserId.validationScheme), getAllByUserId);
  router.get('/:userID/:albumID', getAlbumById); //zal nooit gebruikt worden
  
  router.put('/:albumID', addFotoToAlbum);
  //router.put('/:id/rename', renameAlbum);

  app.use(router.routes()).use(router.allowedMethods());

}