const { tables } = require('..');
const Role = require('../../core/roles');

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

        // Reset auto-increment values
        await knex.raw('ALTER TABLE ?? AUTO_INCREMENT = 1', [tables.fotoalbum_foto]);
        await knex.raw('ALTER TABLE ?? AUTO_INCREMENT = 1', [tables.fotoalbum]);
        await knex.raw('ALTER TABLE ?? AUTO_INCREMENT = 1', [tables.foto]);
        await knex.raw('ALTER TABLE ?? AUTO_INCREMENT = 1', [tables.users]);

        // add new data to table:
        // userID | email | passwordHash | roles (all passwords are 12345678)
        // all stored hashes are different, however they all decode to the same p.w. -> n-runs of testpw.js
        await knex(tables.users).insert([
            { userID: 1, email: 'first.user@hotmail.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$jCb6jJS7xOhyEJKXyBpjlg$qipMaRR/WVc0agyhqx+ykDnmMYb7lWFlzKeIoXyCkbk', 
                roles: JSON.stringify([Role.USER])
            },
            { userID: 2, email: 'second.user@hotmail.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$EI6lB0hmQosa/H6bo1I5Fw$lnLj5ZU9r2yimdN9DY/X7n/qXIwqGencj1FnWF9kFlk', 
                roles: JSON.stringify([Role.USER]) },
            { userID: 3, email: 'third.user@hotmail.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$JTGPAhrUSEamvez5NKw63A$aDI63Phn/RA/1lxVGBu1eGOK2ECRtJUwHlJz+pPcPJw', 
                roles: JSON.stringify([Role.USER]) },
            { userID: 4, email: 'fourth.user@hotmail.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$wx/txvjhtS+cuy7B3eRIfg$5Wch+oaqBSS+R5ce3tMTo3dGnvHKPt3AeZZLuazS5SY', 
                roles: JSON.stringify([Role.USER]) },
            { userID: 5, email: 'fifth.user@hotmail.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$fwWBt1MrQIV9V96PfrcpDA$mXeuWu2uV80ryS9iqv9WKdcBaSxgvqIHWyMZYbG+fIM', 
                roles: JSON.stringify([Role.USER]) },
            { userID: 6, email: 'sixth.admin@hotmail.com', passwordHash: '$argon2id$v=19$m=131072,t=6,p=4$JFLiS6mqGm5JGwUYkRZblQ$nRGWnhN2ONTpEbW8rEICzZpkgpPK9UUMQMMM7bcdgRQ', 
                roles: JSON.stringify([Role.USER, Role.ADMIN]) },
        ]);
    },
};