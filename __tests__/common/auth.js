//dit voert 2 tests uit om te testen of de gebruiker ingelogd is en een geldig token heeft
//voer ze uit op endpoints waarvoor de gebruiker ingelogd moet zijn
const testAuthHeader = (requestFactory) => {

  test('it should 401 when no authorization token provided', async () => {
    const response = await requestFactory();

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe('UNAUTHORIZED');
    expect(response.body.message).toBe('You need to be signed in');
  });


  test('it should 401 when invalid authorization token provided', async () => {
    const response = await requestFactory().set(
      'Authorization',
      'INVALID TOKEN'
    );

    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe('UNAUTHORIZED');
    expect(response.body.message).toBe('Invalid authentication token');
  });
};

module.exports = {
  testAuthHeader,
};
