"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const knex_1 = __importDefault(require("../../../src/infra/database/knex/knex"));
const DatabaseHandler = {
    cleanDatabase: async () => {
        const tableNames = [
            "orders",
            "carts",
            "lineItems",
            "vouchers",
            "products",
            "buyers",
        ];
        await tableNames.reduce((acc, name) => {
            return acc.then(() => (0, knex_1.default)(name).delete());
        }, Promise.resolve(0));
        return Promise.resolve("Database was cleared!");
    },
    closeDatabase: async () => {
        return knex_1.default.destroy();
    },
};
module.exports = { DatabaseHandler };
