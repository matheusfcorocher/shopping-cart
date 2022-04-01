"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Update with your config settings.
const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DEV_DATABASE, DB_TEST_DATABASE } = process.env;
const config = {
    development: {
        client: "pg",
        connection: {
            host: DB_HOST,
            port: DB_PORT ? parseInt(DB_PORT) : 5432,
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
            port: DB_PORT ? parseInt(DB_PORT) : 5432,
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
module.exports = config;
