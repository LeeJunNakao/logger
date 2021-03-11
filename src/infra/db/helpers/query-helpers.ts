import pg from './connect-helper';

export const truncateDatabase = async(): Promise<void> => {
  const listTables = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' AND tablename != 'migrations'";
  const { rows } = await pg.query(listTables, null);
  const tablesNames = rows.map(table => table.tablename);
  const stringfiedNames = tablesNames.join(', ');
  const truncateQuery = `TRUNCATE TABLE ${stringfiedNames} RESTART IDENTITY CASCADE`;
  await pg.query(truncateQuery, null);
};
