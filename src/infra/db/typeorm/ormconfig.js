const dotenv = require("dotenv");

dotenv.config();

const config = {
  type: "postgres",
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ["../../../domain/models/**/*.ts"],
  migrations: ["**/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

module.exports = config;
