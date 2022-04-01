"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsListHandler = void 0;
const ProductSerializer_1 = require("../serializers/ProductSerializer");
const getProductsListHandler = async (req, reply) => {
    try {
        const { listProducts } = req.container.products;
        const result = await listProducts.execute();
        reply.send(result.map(r => ProductSerializer_1.ProductSerializer.serialize(r)));
    }
    catch (error) {
        switch (error.CODE) {
            default:
                const { message, details } = error;
                return reply.status(500).send({ message, details });
        }
    }
};
exports.getProductsListHandler = getProductsListHandler;
