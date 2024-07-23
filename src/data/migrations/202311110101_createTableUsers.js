const { tables } = require(".."); // 1 map omhoog + niet verder gespecifieerd = zoek default(index)

module.exports = {
    up: async(knex) => {
        await knex.schema.createTable(tables.users, (table) => {
            table.increments('userID');
            table.string('email', 255).notNullable();
            table.string('passwordHash', 255).notNullable();
            table.jsonb('roles').notNullable();

            table.unique('email', 'idx_user_email_unique');
        })
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.users);
    }
}