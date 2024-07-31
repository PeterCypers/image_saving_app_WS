const Router = require('@koa/router');
const Joi = require('joi');
const validate = require('../core/validation');
const albumService = require('../service/album');
const { getLogger } = require('../core/logging'); //testing
const { requireAuthentication /*, makeRequireRole */} = require('../core/auth');


const getAllAlbums = async (ctx) => {
  const { userID } = ctx.state.session;
  ctx.body = await albumService.getAll(userID);
};
getAllAlbums.validationScheme = null;

//zal nooit gebruikt worden, enkel intern in servicelaag(create album)
//ook probleem met 2 parameters in get by id
const getAlbumById = async (ctx) => {
  const { userID } = ctx.state.session;
  ctx.body = await albumService.getById(Number(ctx.params.albumID), userID);
}
getAlbumById.validationScheme = {
  params: Joi.object({
    albumID: Joi.number().integer().positive(),
  }),
};

// TODO:
const deleteAlbum = async (ctx) => {
  await fotoService.deleteById(ctx.params.id);
  ctx.status = 204;
};

//spread operator verzamelt alle properties en stelt ze gelijk aan zichzelf ~ zie obj.destru.
//enkel de values die moeten aangepast worden (casting from strings to ...) aanpassen
//datum moet niet meegegeven worden aan front-end, zal hier gemaakt worden & in service geformat
/**
 * 
 * @param {*} ctx albumname
 */
const createAlbum = async (ctx) => {
  const { userID } = ctx.state.session;

  const newAlbum = await albumService.create({
    ...ctx.request.body, // bevat enkel <albumName> ... maar die mag als string blijven
    creationDate: new Date(), // nieuw date doorsturen, formatting in service-laag
    userID: userID,
  });

  ctx.status = 201;
  ctx.body = newAlbum;
}
createAlbum.validationScheme = {
  body: {
    albumName: Joi.string().max(25),
  },
};


/**
 * 
 * @param {*} ctx body: albumName, fotoID
 * 
 * albumName may not be empty or over 25 chars long and may not already exist
 * 
 * edge-case: the body has a fotoID -> it is 'technically' possible for a user to add someone elses foto to their albums
 * the user should never get in that case considering no fotos of another user will be visible in their browser
 */
const createAlbumAndAddFoto = async (ctx) => {
  const { userID } = ctx.state.session;

  const newAlbum = await albumService.createAndAddFoto({
    ...ctx.request.body, // albumName, fotoID
    creationDate: new Date(), //moved formatting to service
    userID: userID,
  });

  ctx.status = 201;
  ctx.body = newAlbum;
}
createAlbumAndAddFoto.validationScheme = {
  body: {
    albumName: Joi.string().min(1).max(25),
    fotoID: Joi.number().integer().positive(),
  },
};

/**
 * empty body
 * 
 * @param {*} ctx params: albumID, imageID
 * 
 * should not be able to add foto to album if it is already in that album
 */
const addFotoToAlbum = async (ctx) => {
  const albumFoto = await albumService.addFotoToAlbum(Number(ctx.params.albumID), Number(ctx.params.imageID));
  ctx.status = 201;
  ctx.body = albumFoto;
}
addFotoToAlbum.validationScheme = {
  params: Joi.object({
    albumID: Joi.number().integer().positive(),
    imageID: Joi.number().integer().positive(),
  }),
};

const getAlbumImages = async (ctx) => {
  ctx.body = await albumService.getAlbumImages(Number(ctx.params.albumID));
}
getAlbumImages.validationScheme = {
  params: Joi.object({
    albumID: Joi.number().integer().positive(),
  }),
};


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

  //zelfde als bij elk request zetten, voor al deze endpoints moet de gebruiker ingelogd zijn
  router.use(requireAuthentication);

  // GET /albums: Retrieve all albums for the logged-in user.
  // GET /albums/{albumId}: Retrieve metadata for a specific album.
  // GET /albums/{albumId}/images: Retrieve all images for a specific album.
  // POST /albums: Create a new album.
  // POST /albums/{albumId}/{imageId}: Add an image to an album.
  // POST /albums/create-and-add-photo  -> special request, new albumname and fotoID in de body
  // PUT /albums/{albumId}: Update the name of a specific album.
  // DELETE /albums/{albumId}/images/{imageId}: Remove a specific image from a specific album

  //done
  router.get('/', validate(getAllAlbums.validationScheme), getAllAlbums); // get all albums for logged in user
  router.get('/:albumID', validate(getAlbumById.validationScheme), getAlbumById); // get one album by id for logged in user
  router.get('/:albumID/images', validate(getAlbumImages.validationScheme), getAlbumImages); //get all images by album

  router.post('/', validate(createAlbum.validationScheme), createAlbum); // create a new album for logged in user
  router.post('/:albumID/:imageID', validate(addFotoToAlbum.validationScheme), addFotoToAlbum); // add existing foto to existing album if it's not already added
  router.post('/create-and-add-photo', validate(createAlbumAndAddFoto.validationScheme), createAlbumAndAddFoto); // special request, combines createAlbum & addFotoToAlbum

  //todo  (not urgent)
  //router.put('/:albumID', updateAlbumName);
  //router.delete('/:albumID', deleteById); // delete an album by id
  //router.delete('/:albumID/images/:imageID', removeImageFromAlbum) // removes an image from an album

  app.use(router.routes()).use(router.allowedMethods());

}