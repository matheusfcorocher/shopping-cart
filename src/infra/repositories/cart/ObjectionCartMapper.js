"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionCartMapper = void 0;
const entities_1 = require("../../../domain/entities");
const ObjectionCartMapper = {
    toEntity(dataValues, aditionalProps) {
        const { uuid, buyerId, } = dataValues;
        const { lineItems, appliedVoucher } = aditionalProps;
        return new entities_1.Cart({
            id: uuid,
            buyerId,
            lineItems,
            appliedVoucher
        });
    },
    toDatabase(cart) {
        const { id, buyerId } = cart;
        const { voucherId, type, amount, minValue } = (cart.appliedVoucher || {});
        return {
            uuid: id,
            buyerId,
            voucherId,
            type,
            amount,
            minValue
        };
    },
};
exports.ObjectionCartMapper = ObjectionCartMapper;
