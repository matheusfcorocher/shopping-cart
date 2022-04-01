"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeOrderRepository = void 0;
const uuid_1 = require("uuid");
class FakeOrderRepository {
    constructor(orders) {
        this.orders = orders;
    }
    getAllOrders() {
        return Promise.resolve(this.orders);
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    store(order) {
        this.orders.push(order);
        return Promise.resolve("Order was emitted sucessfully!");
    }
}
exports.FakeOrderRepository = FakeOrderRepository;
