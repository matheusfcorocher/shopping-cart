"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Product {
    constructor({ id, name, price, available }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.available = available;
    }
    isAvailable() {
        return this.available > 0;
    }
}
exports.default = Product;
