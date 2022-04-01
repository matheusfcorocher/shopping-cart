import type { Knex } from "knex";
import * as dotenv from 'dotenv';

dotenv.config();

// Update with your config settings.
const {DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DEV_DATABASE, DB_TEST_DATABASE} = process.env;
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: DB_HOST,
      port: DB_PORT?parseInt(DB_PORT):5432,
      database: DB_DEV_DATABASE,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      charset: 'utf8'
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: __dirname + '/knex/seeds',
      extension: 'ts'
    }
  },
  test: {
    client: "pg",
    connection: {
      host: DB_HOST,
      port: DB_PORT?parseInt(DB_PORT):5432,
      database: DB_TEST_DATABASE,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      charset: 'utf8'
    }
  },
  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

module.exports = config
