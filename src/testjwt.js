const { generateJWT, verifyJWT } = require('./core/jwt');

function messWithPayload(jwt) {
  const [header, payload, signature] = jwt.split('.');
  const parsedPayload = JSON.parse(
    Buffer.from(payload, 'base64url').toString()
  );

  // make me admin please ^^
  parsedPayload.roles.push('admin');

  const newPayload = Buffer.from(
    JSON.stringify(parsedPayload),
    'ascii'
  ).toString('base64url');
  return [header, newPayload, signature].join('.');
}

async function main() {
  const fakeUser = {
    id: 1,
    firstName: 'Thomas',
    lastName: 'Aelbrecht',
    email: 'thomas.aelbrecht@hogent.be',
    roles: ['user'],
  };

  const jwt = await generateJWT(fakeUser);
  // copy and paste the JWT in the textfield on https://jwt.io
  // inspect the content
  console.log('The JWT:', jwt);

  let valid = await verifyJWT(jwt);
  console.log('This JWT is', valid ? 'valid' : 'incorrect');

  // Let's mess with the payload
  const messedUpJwt = messWithPayload(jwt);
  console.log('Messed up JWT:', messedUpJwt);

  console.log('Verifying this JWT will throw an error:');
  valid = await verifyJWT(messedUpJwt);
}

main();
