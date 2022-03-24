import {knex, Knex} from "knex";
import { Model } from "objection";

const config = require('../config');
const environment = process.env.NODE_ENV || "development"

const knexInstance : Knex = knex(config[environment])

//uncomment this function to see db queries
// knexInstance.on('query', (queryData) => {
//     console.log(queryData);
// });

Model.knex(knexInstance);

export default knexInstance;
export { Model };

