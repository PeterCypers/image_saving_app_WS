let { TRANSACTIONS, PLACES } = require('../data/mock_data');

const getAll = () => {
    return {count:TRANSACTIONS.length, items: TRANSACTIONS}
}

module.exports={getAll}