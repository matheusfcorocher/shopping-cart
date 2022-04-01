"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Voucher {
    constructor({ id, code, type, amount, minValue }) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.amount = amount;
        this.minValue = minValue;
    }
}
exports.default = Voucher;
