import {knex, Knex} from "knex";
import { Model } from "objection";

const config = require('../config');
const environment = process.env.NODE_ENV || "development"

const knexInstance : Knex = knex(config[environment])
Model.knex(knexInstance);

export default knexInstance;
export { Model };


