const config = require('config');
const jwt = require('jsonwebtoken');

const JWT_AUDIENCE = config.get('auth.jwt.audience');
const JWT_SECRET = config.get('auth.jwt.secret');
const JWT_ISSUER = config.get('auth.jwt.issuer');
const JWT_EXPIRATION_INTERVAL = config.get('auth.jwt.expirationInterval');


const generateJWT = (user) => {

  const tokenData = {
    userId: user.id,    //TODO controlleer of het niet user.userID moet zijn...
    roles: user.roles,
  };


  const signOptions = {
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth', // zou ook userID bij kunnen zetten
  };

 
  return new Promise((resolve, reject) => {
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err) {
        console.log('Error while signing new token:', err.message);
        return reject(err);
      }
      return resolve(token);
    });
  });
};

const verifyJWT = (authToken) => {

  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  };


  return new Promise((resolve, reject) => {
    jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
      if (err || !decodedToken) {
        console.log('Error while verifying token:', err.message);
        return reject(err || new Error('Token could not be parsed'));
      }
      return resolve(decodedToken);
    });
  });
};

module.exports = {
  generateJWT,
  verifyJWT,
};
