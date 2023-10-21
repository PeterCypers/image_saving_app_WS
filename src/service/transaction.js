let { TRANSACTIONS, PLACES } = require('../data/mock_data');

const getAll = () => {
    return {count:TRANSACTIONS.length, items: TRANSACTIONS}
}

const getById = (id) => {
    return TRANSACTIONS.find(t=> t.id === id);
}

const create = ({user, amount, placeId, date}) => {
    const place = PLACES.find(p => p.id === placeId);
    if(!place) throw new Error("place does not exist");
    if(typeof user === 'string'){
        user = {
            id: Math.floor(Math.random() * 10_000),
            name: user
        }
    }

    const newTransaction = {
        id: Math.max(...TRANSACTIONS.map(t => t.id)) + 1,
        amount, // amount:amount
        place,
        user,
        date: date.toISOString()
    }

    TRANSACTIONS = [newTransaction, ...TRANSACTIONS];

    return newTransaction;
}

const updateById = (id, {user, amount, date, placeId}) => {
    const index = TRANSACTIONS.findIndex(t => t.id === id);
    if(index === -1) throw new Error("transaction does not exist");

    const place = PLACES.find(p => p.id === placeId);
    if(!place) throw new Error("place does not exist");
    if(typeof user === 'string'){
        user = {
            id: Math.floor(Math.random() * 10_000),
            name: user
        }
    }

    const updatedTransaction = {
        ...TRANSACTIONS[index],
        amount,
        date: date.toISOString(),
        place,
        user
    }

    TRANSACTIONS[index] = updatedTransaction;

    return updatedTransaction;

}

const deleteById = (id) => {
    TRANSACTIONS = TRANSACTIONS.filter(t => t.id != id);
}

module.exports={ getAll, create, getById, updateById, deleteById }