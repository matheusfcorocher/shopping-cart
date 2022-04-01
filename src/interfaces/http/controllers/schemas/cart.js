"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVoucherSchema = exports.removeLineItemSchema = exports.getCurrentCartSchema = exports.applyVoucherSchema = exports.addLineItemSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
//schemas body
const addLineItemObj = typebox_1.Type.Object({
    buyerId: typebox_1.Type.String(),
    productId: typebox_1.Type.String(),
});
const applyVoucherObj = typebox_1.Type.Object({
    buyerId: typebox_1.Type.String(),
    code: typebox_1.Type.String(),
});
//cart response obj
const lineItemObj = typebox_1.Type.Object({
    productId: typebox_1.Type.String(),
    unitPrice: typebox_1.Type.Number(),
    quantity: typebox_1.Type.Number(),
});
const lineItemsObj = typebox_1.Type.Array(lineItemObj);
const appliedVoucherObj = typebox_1.Type.Object({
    voucherId: typebox_1.Type.String(),
    type: typebox_1.Type.String(),
    amount: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()])),
    minValue: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()])),
});
const cartObj = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    buyerId: typebox_1.Type.Optional(typebox_1.Type.String()),
    lineItems: lineItemsObj,
    appliedVoucher: typebox_1.Type.Union([typebox_1.Type.Optional(appliedVoucherObj), typebox_1.Type.Null()]),
});
const httpResponseError = typebox_1.Type.Object({
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    title: typebox_1.Type.String(),
    status: typebox_1.Type.String(),
    detail: typebox_1.Type.String(),
    instance: typebox_1.Type.Optional(typebox_1.Type.String()),
});
//schemas
const addLineItemSchema = {
    body: addLineItemObj,
    response: {
        200: cartObj
    },
};
exports.addLineItemSchema = addLineItemSchema;
const applyVoucherSchema = {
    body: applyVoucherObj,
    response: {
        200: cartObj
    },
};
exports.applyVoucherSchema = applyVoucherSchema;
const getCurrentCartSchema = {
    params: {
        buyerId: typebox_1.Type.String()
    },
    response: {
        200: cartObj
    },
};
exports.getCurrentCartSchema = getCurrentCartSchema;
const removeLineItemSchema = {
    body: addLineItemObj,
    response: {
        200: cartObj
    },
};
exports.removeLineItemSchema = removeLineItemSchema;
const removeVoucherSchema = {
    params: {
        buyerId: typebox_1.Type.String()
    },
    response: {
        200: cartObj
    },
};
exports.removeVoucherSchema = removeVoucherSchema;
