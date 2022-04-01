"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppliedVoucher = exports.ShippingVoucher = exports.PercentualVoucher = exports.FixedVoucher = void 0;
class AppliedVoucher {
    constructor({ voucherId, type, amount, minValue }) {
        this.voucherId = voucherId;
        this.type = type;
        this.amount = amount;
        this.minValue = minValue;
    }
}
exports.AppliedVoucher = AppliedVoucher;
//FixedVoucher
class FixedVoucher extends AppliedVoucher {
    constructor({ voucherId, type, amount, }) {
        super({ voucherId, type, amount });
    }
    apply(subtotal, shipping) {
        return this.amount;
    }
}
exports.FixedVoucher = FixedVoucher;
//PercentualVoucher
class PercentualVoucher extends AppliedVoucher {
    constructor({ voucherId, type, amount, }) {
        super({ voucherId, type, amount });
        if (!this.isInRange()) {
            const internalError = new Error("Internal Error");
            internalError.message = "PercentualVoucher must have an amount between 0 and 100.";
            throw internalError;
        }
    }
    apply(subtotal, shipping) {
        return subtotal * this.amount / 100;
    }
    isInRange() {
        return this.amount >= 0 && this.amount <= 100;
    }
}
exports.PercentualVoucher = PercentualVoucher;
//ShippingVoucher
class ShippingVoucher extends AppliedVoucher {
    constructor({ voucherId, type, minValue, }) {
        super({ voucherId, type, minValue });
    }
    apply(subtotal, shipping) {
        if (subtotal >= this.minValue) {
            return shipping;
        }
        return 0;
    }
}
exports.ShippingVoucher = ShippingVoucher;
