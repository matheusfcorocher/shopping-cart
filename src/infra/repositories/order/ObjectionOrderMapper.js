"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionOrderMapper = void 0;
const entities_1 = require("../../../domain/entities");
const ObjectionOrderMapper = {
    toEntity(orderModel, lineItems) {
        const { uuid, buyerId, discount, paymentMethod, } = orderModel;
        return new entities_1.Order({
            id: uuid,
            buyerId,
            lineItems,
            discount,
            paymentMethod,
        });
    },
    toDatabase(order) {
        const { id, buyerId, discount, paymentMethod } = order;
        return {
            uuid: id,
            buyerId,
            discount,
            paymentMethod,
        };
    },
};
exports.ObjectionOrderMapper = ObjectionOrderMapper;
