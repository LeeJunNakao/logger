import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool();

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
