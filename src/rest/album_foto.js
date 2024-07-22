



/**
 * Install albumfoto routes in the given router.
 * 
 * DB: fotoID | albumID
 * 
 * beide fields zijn FK
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/albumfoto',
  });

  router.get('/', getAllAlbums); //wordt niet gebruikt
  router.post('/', validate(createAlbum.validationScheme), createAlbum);
  router.get('/:id', validate(getAllByUserId.validationScheme), getAllByUserId);
  router.get('/:userID/:albumID', getAlbumById); //zal nooit gebruikt worden
  
  router.put('/:id', updateAlbum);

  app.use(router.routes()).use(router.allowedMethods());

}