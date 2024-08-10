const config = require('config');
const { initializeLogger } = require('../src/core/logging');
const Role = require('../src/core/roles');
const { initializeData, getKnex, tables } = require('../src/data');

module.exports = async () => {
  // Create a database connection
  initializeLogger({
    level: config.get('logging.level'), //moet logging.level zijn (veranderd van log.level)
    disabled: config.get('logging.disabled'), //moet logging.disabled zijn (veranderd van log.disabled)
  });
  await initializeData();

  // Insert a test user with password 12345678
  const knex = getKnex();

  await knex(tables.users).insert([
    {
      userID: 1,
      //name: 'Test User',
      email: 'test.user@hogent.be',
      passwordHash:
        '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
      roles: JSON.stringify([Role.USER]),
    },
    {
      userID: 2,
      //name: 'Admin User',
      email: 'test.admin@hogent.be',
      passwordHash:
        '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
      roles: JSON.stringify([Role.ADMIN, Role.USER]),
    },
  ]);
};
