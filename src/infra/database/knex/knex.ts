import {knex, Knex} from "knex";

const config = require('../config');
const environment = process.env.NODE_ENV || "development"

const knexInstance : Knex = knex(config[environment])

//uncomment this function to see db queries
// knexInstance.on('query', (queryData) => {
//     console.log(queryData);
// });

export default knexInstance;

