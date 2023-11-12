const { tables } = require("..");

module.exports = {
    up: async(knex) => {
        await knex.schema.createTable(tables.foto, (table) => {
            table.increments('fotoID');
            table.string('location', 255);
            table.dateTime('dateUploaded');
            table.integer('userID').unsigned().notNullable();
            table.foreign('userID', 'FK_Foto_Users')
            .references(`${tables.users}.userID`)
            .onDelete('CASCADE'); //RESTRICT is de default -> je kan alleen user verwijderen als er geen fotos meer zijn
        })
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.foto);
    }
}