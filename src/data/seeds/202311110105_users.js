const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        // delete all entries:
        await knex(tables.users).delete();

        // add new data to table:
        // (firstName, lastName, passwordHash) 
        await knex(tables.users).insert([
            { firstName: 'David', lastName: 'Bowie', passwordHash: 'B0B71BC6697DE5D6D7287436459C1CD7FB50150B20B955CC1C37C9466D06858F' },
            { firstName: 'Bruce', lastName: 'Dickinson', passwordHash: 'E9299A4A9BCF81DBDA11BDB42DE880D95EFE0B9A9C43B6F56C313EB7A0FD0CF5' },
            { firstName: 'Dave', lastName: 'Mustaine', passwordHash: '9E492FD5A1ACBDEE394C7BF8BB37DEA3181E839FA138B9D737D65ACCFE23BCA0' },
            { firstName: 'Damon', lastName: 'Albarn', passwordHash: 'CA227130C8483D84A404FC496E0AA8A2DCF6421C44C826C21ADDE38564EA887C' },
            { firstName: 'David', lastName: 'Draiman', passwordHash: '87B31EF176B701DA34786634FFB6A9A1703CB67AFC53FA3CE1948CCD827DAD80' },
            { firstName: 'Mary Elizabeth', lastName: 'McGlynn', passwordHash: '9A26A6101FBE719765E96537A962743005F3BCA36907B054B5C4E53CBC1A89DE' },
        ]);
    },
};