"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductModel_1 = require("../../../../src/infra/database/knex/models/ProductModel");
const ProductModelFactory = {
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
        return Promise.resolve(ProductModel_1.ProductModel.query().insert(data));
    },
};
exports.default = ProductModelFactory;
