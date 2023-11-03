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
  
  module.exports = { TRANSACTIONS, PLACES };
  