"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BuyerModel_1 = require("../../../../src/infra/database/knex/models/BuyerModel");
const BuyerModelFactory = {
    createList: function (list) {
        try {
            return Promise.all(list.map((d) => this.create(d)));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    },
    create: function (data) {
        return Promise.resolve(BuyerModel_1.BuyerModel.query().insert(data));
    },
};
exports.default = BuyerModelFactory;
