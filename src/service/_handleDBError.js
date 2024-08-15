//bij toevoegen van een nieuwe album, de DB kan een error geven op constraint albumName=unique
const ServiceError = require('../core/serviceError');

const handleDBError = (error) => {
  const { code = '', sqlMessage } = error;

  if (code === 'ER_DUP_ENTRY') {
    switch (true) {
      /* edge-case -> multiple users can choose the same album-name -> see: migrations/createTableFotoAlbum.js */
      // case sqlMessage.includes('idx_album_name_unique'):
      //   return ServiceError.validationFailed(
      //     'An album with this name already exists'
      //   );
        
      case sqlMessage.includes('idx_user_email_unique'):
        return ServiceError.validationFailed(
          'There is already a user with this email address'
        );
      default:
        return ServiceError.validationFailed('This item already exists');
    }
  }
  
  if (code.startsWith('ER_NO_REFERENCED_ROW')) {
    switch (true) {
      case sqlMessage.includes('FK_Foto_Users'):
        return ServiceError.notFound('This user does not exist');
      case sqlMessage.includes('FK_FotoAlbum_Foto_FotoAlbum'):
        return ServiceError.notFound('This album does not exist');
    }
  }

  // Return error because we don't know what happened
  return error;
};

module.exports = handleDBError;
