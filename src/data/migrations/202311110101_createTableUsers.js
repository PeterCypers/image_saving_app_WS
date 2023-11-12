const { tables } = require(".."); // 1 map omhoog + niet verder gespecifieerd = zoek default(index)

module.exports = {
    up: async(knex) => {
        await knex.schema.createTable(tables.users, (table) => {
            table.increments('userID');
            table.string('firstName', 255);
            table.string('lastName', 255);
            table.string('passwordHash', 255);
        })
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.users);
    }
}