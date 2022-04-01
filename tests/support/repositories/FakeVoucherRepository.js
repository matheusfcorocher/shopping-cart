"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeVoucherRepository = void 0;
const uuid_1 = require("uuid");
class FakeVoucherRepository {
    constructor(vouchers) {
        this.vouchers = vouchers;
    }
    getAllVouchers() {
        return Promise.resolve(this.vouchers);
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    getVoucherByCode(code) {
        const result = this.vouchers.filter((voucher) => voucher.code.normalize() === code.normalize())[0];
        if (result === undefined) {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `Voucher with code ${code} can't be found.`;
            return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    getVoucherById(id) {
        const result = this.vouchers.filter((voucher) => voucher.id === id)[0];
        if (result === undefined) {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `Voucher with id ${id} can't be found.`;
            return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
}
exports.FakeVoucherRepository = FakeVoucherRepository;
