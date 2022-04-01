"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const config = require('../config');
const environment = process.env.NODE_ENV || "development";
const knexInstance = (0, knex_1.knex)(config[environment]);
//uncomment this function to see db queries
// knexInstance.on('query', (queryData) => {
//     console.log(queryData);
// });
exports.default = knexInstance;
