"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeCartRepository = void 0;
const uuid_1 = require("uuid");
const entities_1 = require("../../../src/domain/entities");
class FakeCartRepository {
    constructor(carts) {
        this.carts = carts;
    }
    getAllCarts() {
        return Promise.resolve(this.carts);
    }
    getCartByBuyerId(buyerId) {
        const result = this.carts.filter((cart) => cart?.buyerId?.normalize() === buyerId.normalize())[0];
        if (result === undefined) {
            const lineItems = [];
            const newCart = new entities_1.Cart({
                id: this.getNextId(),
                buyerId: this.getNextId(),
                lineItems,
            });
            return Promise.resolve(newCart);
        }
        return Promise.resolve(result);
    }
    getCartById(id) {
        const result = this.carts.filter((cart) => cart.id === id)[0];
        if (result === undefined) {
            const notFoundError = new Error("Not Found Error");
            notFoundError.message = `Cart with id ${id} can't be found.`;
            return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    delete(cart) {
        const index = this.carts.findIndex(c => c.id.normalize() === cart.id.normalize());
        this.carts.splice(index, 1);
        return Promise.resolve('Cart was deleted!');
    }
    update(cart) {
        return Promise.resolve(cart);
    }
}
exports.FakeCartRepository = FakeCartRepository;
