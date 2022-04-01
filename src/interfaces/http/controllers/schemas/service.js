"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const checkoutObj = typebox_1.Type.Object({
    cartId: typebox_1.Type.String(),
    buyerId: typebox_1.Type.String(),
    paymentMethod: typebox_1.Type.String(),
});
const checkoutSchema = {
    body: checkoutObj,
    response: {
        200: typebox_1.Type.String()
    },
};
exports.checkoutSchema = checkoutSchema;
