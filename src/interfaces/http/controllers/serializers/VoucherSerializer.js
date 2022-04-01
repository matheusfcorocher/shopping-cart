"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherSerializer = void 0;
const VoucherSerializer = {
    serialize({ id, code, type, amount, minValue }) {
        return {
            id,
            code,
            type,
            amount,
            minValue,
        };
    },
};
exports.VoucherSerializer = VoucherSerializer;
