"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const product_1 = require("../controllers/handlers/product");
const product_2 = require("../controllers/schemas/product");
const listProductsOpts = {
    schema: product_2.listProductsSchema,
    handler: product_1.getProductsListHandler,
};
const productsRoutes = (fastify, options, done) => {
    fastify.get("/api/products", listProductsOpts);
    done();
};
exports.productsRoutes = productsRoutes;
