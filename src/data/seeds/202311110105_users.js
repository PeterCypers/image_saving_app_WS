const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // delete all entries:
        /** volgorde van groot belang: zie DB-creatie-Script (in web-services folder)
         * ---------------------------------------------------------------------------
         * als in een andere tabel naar een entry verwezen wordt als foreign key moet je eerst die
         * andere tabel zijn entries verwijderen dan pas de entry in current table waar die key naar verwees
         * 
         * alle deletes naar hier verhuisd
         * 
         * auto-increments moeten in seeding expliciet meegegeven worden (niet zoals in DB-creatie script)
         */
        await knex(tables.fotoalbum_foto).delete();
        await knex(tables.fotoalbum).delete();
        await knex(tables.foto).delete();
        await knex(tables.users).delete();

        // add new data to table:
        // (firstName, lastName, passwordHash) 
        await knex(tables.users).insert([
            { userID: 1, firstName: 'David', lastName: 'Bowie', passwordHash: 'B0B71BC6697DE5D6D7287436459C1CD7FB50150B20B955CC1C37C9466D06858F' },
            { userID: 2, firstName: 'Bruce', lastName: 'Dickinson', passwordHash: 'E9299A4A9BCF81DBDA11BDB42DE880D95EFE0B9A9C43B6F56C313EB7A0FD0CF5' },
            { userID: 3, firstName: 'Dave', lastName: 'Mustaine', passwordHash: '9E492FD5A1ACBDEE394C7BF8BB37DEA3181E839FA138B9D737D65ACCFE23BCA0' },
            { userID: 4, firstName: 'Damon', lastName: 'Albarn', passwordHash: 'CA227130C8483D84A404FC496E0AA8A2DCF6421C44C826C21ADDE38564EA887C' },
            { userID: 5, firstName: 'David', lastName: 'Draiman', passwordHash: '87B31EF176B701DA34786634FFB6A9A1703CB67AFC53FA3CE1948CCD827DAD80' },
            { userID: 6, firstName: 'Mary Elizabeth', lastName: 'McGlynn', passwordHash: '9A26A6101FBE719765E96537A962743005F3BCA36907B054B5C4E53CBC1A89DE' },
        ]);
    },
};