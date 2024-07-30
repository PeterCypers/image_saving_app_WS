const { tables } = require(".."); 
module.exports = {
    up: async(knex) => {
        await knex.schema.createTable(tables.fotoalbum, (table) => {
            table.increments('albumID');
            table.string('albumName', 255);
            table.dateTime('creationDate');
            table.integer('userID').unsigned().notNullable();
            /*outdated (*): 
            album naam moet uniek zijn:
            table.unique('albumName', 'idx_album_name_unique');*/
            
            //(*) refactor -> edgecase -> verschillende users willen dezelfde album-naam -> dit moet kunnen

            table.foreign('userID', 'FK_FotoAlbum_Users')
            .references(`${tables.users}.userID`)
            .onDelete('CASCADE');
        })
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.fotoalbum);
    }
}