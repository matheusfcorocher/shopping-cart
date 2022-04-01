"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartsRoutes = void 0;
const cart_1 = require("../controllers/handlers/cart");
const cart_2 = require("../controllers/schemas/cart");
const addLineItemOpts = {
    handler: cart_1.addLineItemHandler,
    schema: cart_2.addLineItemSchema,
};
const applyVoucherOpts = {
    handler: cart_1.applyVoucherHandler,
    schema: cart_2.applyVoucherSchema,
};
const getCurrentCartOpts = {
    handler: cart_1.applyVoucherHandler,
    schema: cart_2.applyVoucherSchema,
};
const removeLineItemOpts = {
    handler: cart_1.removeLineItemHandler,
    schema: cart_2.removeLineItemSchema,
};
const removeVoucherOpts = {
    handler: cart_1.removeVoucherHandler,
    schema: cart_2.removeVoucherSchema,
};
const cartsRoutes = (fastify, options, done) => {
    fastify.post("/api/carts/addLineItem", addLineItemOpts);
    fastify.post("/api/carts/applyVoucher", applyVoucherOpts);
    fastify.get("/api/carts/:buyerId", getCurrentCartOpts);
    fastify.put("/api/carts/removeLineItem", removeLineItemOpts);
    fastify.put("/api/carts/removeVoucher/:buyerId", removeVoucherOpts);
    done();
};
exports.cartsRoutes = cartsRoutes;
