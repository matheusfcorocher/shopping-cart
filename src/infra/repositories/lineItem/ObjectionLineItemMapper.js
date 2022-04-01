"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionLineItemMapper = void 0;
const Cart_1 = require("../../../domain/entities/Cart");
const ObjectionLineItemMapper = {
    toEntity(lineItemModel) {
        const { productId, unitPrice, quantity } = lineItemModel;
        return new Cart_1.LineItem(productId, unitPrice, quantity);
    },
    toDatabase(lineItem, additionalProps) {
        const { productId, unitPrice, quantity } = lineItem;
        const { uuid, ownerId, ownerType } = additionalProps;
        return {
            uuid,
            productId,
            unitPrice,
            quantity,
            ownerId,
            ownerType
        };
    },
};
exports.ObjectionLineItemMapper = ObjectionLineItemMapper;
