"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const productObj = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    price: typebox_1.Type.Number(),
    available: typebox_1.Type.Number(),
});
const productArray = typebox_1.Type.Array(productObj);
const listProductsSchema = {
    response: {
        200: productArray,
    },
};
exports.listProductsSchema = listProductsSchema;
