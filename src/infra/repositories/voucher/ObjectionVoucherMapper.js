"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionVoucherMapper = void 0;
const entities_1 = require("../../../domain/entities");
const ObjectionVoucherMapper = {
    toEntity(voucherModel) {
        const { uuid, code, type, amount, minValue } = voucherModel;
        return new entities_1.Voucher({
            id: uuid,
            code,
            type,
            amount,
            minValue,
        });
    },
    toDatabase(voucher) {
        const { id, code, type, amount, minValue } = voucher;
        return {
            uuid: id,
            code,
            type,
            amount,
            minValue: minValue ? minValue : null,
        };
    },
};
exports.ObjectionVoucherMapper = ObjectionVoucherMapper;
