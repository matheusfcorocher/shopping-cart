"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appliedFactory = void 0;
const AppliedVoucher_1 = require("../valueObjects/AppliedVoucher");
const appliedFactory = {
    fromVoucher: function (voucher) {
        const { id, type, amount, minValue } = voucher;
        switch (voucher.type) {
            case "percentual":
                return new AppliedVoucher_1.PercentualVoucher({ voucherId: id, type, amount });
            case "fixed":
                return new AppliedVoucher_1.FixedVoucher({ voucherId: id, type, amount });
            case "free shipping":
                if (minValue)
                    return new AppliedVoucher_1.ShippingVoucher({ voucherId: id, type, amount, minValue });
                throw new Error("minValue field not found in free shipping voucher");
            default:
                throw new Error("Voucher type wasn't found");
        }
    },
};
exports.appliedFactory = appliedFactory;
