const config = require('../config');
const environment = process.env.NODE_ENV || "development"
const knex = require('knex')(config[environment]);

export { knex };
