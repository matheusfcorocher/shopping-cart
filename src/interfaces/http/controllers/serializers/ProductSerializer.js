"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSerializer = void 0;
const ProductSerializer = {
    serialize({ id, name, price, available }) {
        return {
            id,
            name,
            price,
            available,
        };
    },
};
exports.ProductSerializer = ProductSerializer;
