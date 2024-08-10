const { shutdownData, getKnex, tables } = require('../src/data');

// remove tables in oposite order of migrations (avoid FK-PK - problems)
// (remove tables with foreign keys first)
module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.fotoalbum_foto).delete();
  await getKnex()(tables.foto).delete();
  await getKnex()(tables.fotoalbum).delete();
  await getKnex()(tables.users).delete();

  // Close database connection
  await shutdownData();
};
