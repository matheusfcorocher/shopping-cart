"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeProductRepository = void 0;
const uuid_1 = require("uuid");
const entities_1 = require("../../../src/domain/entities");
class FakeProductRepository {
    constructor(products) {
        this.products = products;
    }
    getAllProducts() {
        return Promise.resolve(this.products);
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    getProductById(id) {
        const result = this.products.filter((cargo) => cargo.id.normalize() === id.normalize())[0];
        if (result === undefined) {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `Product with id ${id} can't be found.`;
            return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    update(id, data) {
        const product = this.products.filter((p) => p.id === id)[0];
        const updatedProduct = new entities_1.Product({
            ...product,
            ...data
        });
        const index = this.products.findIndex((p) => p.id === id);
        this.products.splice(index, 1, updatedProduct);
        return Promise.resolve(product);
    }
}
exports.FakeProductRepository = FakeProductRepository;
