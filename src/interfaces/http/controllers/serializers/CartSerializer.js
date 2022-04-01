"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartSerializer = void 0;
const CartSerializer = {
    serialize({ id, buyerId, lineItems, appliedVoucher, }) {
        const serializedLineItems = lineItems.map((lineItem) => {
            const { productId, unitPrice, quantity } = lineItem;
            return { productId, unitPrice, quantity };
        });
        const { voucherId, type, amount, minValue } = (appliedVoucher || {});
        return {
            id,
            buyerId,
            lineItems: serializedLineItems,
            appliedVoucher: { voucherId, type, amount, minValue },
        };
    },
};
exports.CartSerializer = CartSerializer;
