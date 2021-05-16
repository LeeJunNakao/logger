import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
};

const { ssl, ...configDev } = config;

const pool = new Pool(process.env.NODE_DEV ? configDev : config);

pool.on('error', (err, client) => {
  console.log('Postgres Error', err);
  process.exit(-1);
});

const connectionHandler = {
  query(text, params) {
    return pool.query(text, params);
  },
};

export default connectionHandler;
