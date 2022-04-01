"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVoucherHandler = exports.removeLineItemHandler = exports.getCurrentCartHandler = exports.applyVoucherHandler = exports.addLineItemHandler = void 0;
const CustomError_1 = require("../../../../lib/CustomError");
const CartSerializer_1 = require("../serializers/CartSerializer");
const addLineItemHandler = async (req, reply) => {
    try {
        const { addLineItem } = req.container.carts;
        const { buyerId, productId } = req.body;
        const result = await addLineItem.execute(buyerId, productId);
        reply.send(CartSerializer_1.CartSerializer.serialize(result));
    }
    catch (error) {
        const httpResponseError = new CustomError_1.HttpResponseError({
            title: error.title,
            status: error.status,
            detail: error.detail,
        });
        switch (error.status) {
            case 404:
                return reply.status(404).send(httpResponseError.toJson());
            default:
                return reply.status(500).send(httpResponseError);
        }
    }
};
exports.addLineItemHandler = addLineItemHandler;
const applyVoucherHandler = async (req, reply) => {
    try {
        const { applyVoucher } = req.container.carts;
        const { buyerId, code } = req.body;
        const result = await applyVoucher.execute(buyerId, code);
        reply.send(CartSerializer_1.CartSerializer.serialize(result));
    }
    catch (error) {
        switch (error.CODE) {
            default:
                const { message, details } = error;
                return reply.status(500).send({ message, details });
        }
    }
};
exports.applyVoucherHandler = applyVoucherHandler;
const getCurrentCartHandler = async (req, reply) => {
    try {
        const { getCurrentCart } = req.container.carts;
        const { buyerId } = req.params;
        const result = await getCurrentCart.execute(buyerId);
        reply.send(CartSerializer_1.CartSerializer.serialize(result));
    }
    catch (error) {
        switch (error.CODE) {
            default:
                const { message, details } = error;
                return reply.status(500).send({ message, details });
        }
    }
};
exports.getCurrentCartHandler = getCurrentCartHandler;
const removeLineItemHandler = async (req, reply) => {
    try {
        const { removeLineItem } = req.container.carts;
        const { buyerId, productId } = req.body;
        const result = await removeLineItem.execute(buyerId, productId);
        reply.send(CartSerializer_1.CartSerializer.serialize(result));
    }
    catch (error) {
        switch (error.CODE) {
            default:
                const { message, details } = error;
                return reply.status(500).send({ message, details });
        }
    }
};
exports.removeLineItemHandler = removeLineItemHandler;
const removeVoucherHandler = async (req, reply) => {
    try {
        const { removeVoucher } = req.container.carts;
        const { buyerId } = req.params;
        const result = await removeVoucher.execute(buyerId);
        reply.send(CartSerializer_1.CartSerializer.serialize(result));
    }
    catch (error) {
        switch (error.CODE) {
            default:
                return reply.status(500).send(error);
        }
    }
};
exports.removeVoucherHandler = removeVoucherHandler;
