"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderModel_1 = require("../../../../src/infra/database/knex/models/OrderModel");
const OrderModelFactory = {
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
        return Promise.resolve(OrderModel_1.OrderModel.query().insert(data));
    },
};
exports.default = OrderModelFactory;
