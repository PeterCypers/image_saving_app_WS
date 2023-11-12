const { tables } = require("..");

module.exports = {
    up: async(knex) => {
        await knex.schema.createTable(tables.fotoalbum_foto, (table) => {
            table.integer('fotoID').unsigned().notNullable();
            table.foreign('fotoID', 'FK_FotoAlbum_Foto_Foto')
            .references(`${tables.foto}.fotoID`)
            .onDelete('CASCADE');
            table.integer('albumID').unsigned().notNullable();
            table.foreign('albumID', 'FK_FotoAlbum_Foto_FotoAlbum')
            .references(`${tables.fotoalbum}.albumID`)
            .onDelete('CASCADE');
        })
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.fotoalbum_foto);
    }
}