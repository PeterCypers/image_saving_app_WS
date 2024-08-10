// let ipv const -> je laat CRUD operaties toe
//TODO: aanpassen op eigen database
let PLACES = [
    {
      id: 1,
      name: 'Dranken Geers',
      rating: 3,
    },
    {
      id: 2,
      name: 'Irish Pub',
      rating: 2,
    },
    {
      id: 3,
      name: 'Loon',
      rating: 4,
    },
  ];
  
  let TRANSACTIONS = [
    {
      id: 1,
      amount: -2000,
      date: '2021-05-08T00:00:00.000Z',
      user: {
        id: 1,
        name: 'Thomas Aelbrecht',
      },
      place: {
        id: 2,
        name: 'Irish Pub',
      },
    },
    {
      id: 2,
      amount: -74,
      date: '2021-05-21T12:30:00.000Z',
      user: {
        id: 1,
        name: 'Thomas Aelbrecht',
      },
      place: {
        id: 2,
        name: 'Irish Pub',
      },
    },
    {
      id: 3,
      amount: 3500,
      date: '2021-05-25T17:40:00.000Z',
      user: {
        id: 1,
        name: 'Thomas Aelbrecht',
      },
      place: {
        id: 3,
        name: 'Loon',
      },
    },
  ];

  const data = {
    fotos: [{
      fotoID: 1,
      location: 'public/uploads/user1/foto1',
      dateUploaded: new Date(2021, 0, 0, 0, 0),
      userID: 1
    },
    {
      fotoID: 2,
      location: 'public/uploads/user1/foto2',
      dateUploaded: new Date(2021, 1, 1, 1, 1),
      userID: 1
    },
    {
      fotoID: 3,
      location: 'public/uploads/user1/foto3',
      dateUploaded: new Date(2021, 2, 2, 2, 2),
      userID: 1
    },
    {
      fotoID: 4,
      location: 'public/uploads/user1/foto4',
      dateUploaded: new Date(2021, 3, 3, 3, 3),
      userID: 1
    },
    {
      fotoID: 5,
      location: 'public/uploads/user1/foto5',
      dateUploaded: new Date(2021, 4, 4, 4, 4),
      userID: 1
    }],
    albums: [{
      albumID: 1,
      albumName: "full album",
      creationDate: new Date(2021, 0, 0, 0, 0),
      userID: 1
    },
    {
      albumID: 2,
      albumName: "half-full album",
      creationDate: new Date(2021, 1, 1, 1, 1),
      userID: 1
    },
    {
      albumID: 3,
      albumName: "empty album",
      creationDate: new Date(2021, 2, 2, 2, 2),
      userID: 1
    }],
    album_fotos: [{
      fotoID: 1,
      albumID: 1
    },
    {
      fotoID: 2,
      albumID: 1
    },
    {
      fotoID: 3,
      albumID: 1
    },
    {
      fotoID: 4,
      albumID: 1
    },
    {
      fotoID: 5,
      albumID: 1
    },
    {
      fotoID: 1,
      albumID: 2
    },
    {
      fotoID: 2,
      albumID: 2
    },
    {
      fotoID: 3,
      albumID: 2
    }]
  }
  
  const dataToDelete = {
    fotos: [1,2,3,4,5],
    albums: [1,2,3],
  }
  
  module.exports = { TRANSACTIONS, PLACES, data, dataToDelete };
  