"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CartModel_1 = require("../../../../src/infra/database/knex/models/CartModel");
const CartModelFactory = {
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
        return Promise.resolve(CartModel_1.CartModel.query().insert(data));
    },
};
exports.default = CartModelFactory;
