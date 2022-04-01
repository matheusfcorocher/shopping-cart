"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../src/domain/entities");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
describe("Domain :: ValueObjects :: AppliedVoucher", () => {
    describe("#apply", () => {
        describe("if voucher has percentual type", () => {
            it("returns correct value", () => {
                const voucher = new entities_1.Voucher({
                    id: 'aad',
                    code: "#F121221",
                    type: "percentual",
                    amount: 30.0,
                });
                const percentualVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                expect(percentualVoucher.apply(100, 15)).toEqual(percentualVoucher.amount);
            });
        });
        describe("if voucher has fixed type", () => {
            it("returns correct value", () => {
                const voucher = new entities_1.Voucher({
                    id: 'aad',
                    code: "#F121221",
                    type: "fixed",
                    amount: 30.0,
                });
                const percentualVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                expect(percentualVoucher.apply(100, 15)).toEqual(percentualVoucher.amount);
            });
        });
        describe("if voucher has free shipping type", () => {
            describe("and subtotal is equal or more than minValue", () => {
                it("returns correct value", () => {
                    const voucher = new entities_1.Voucher({
                        id: 'aad',
                        code: "#F121221",
                        type: "free shipping",
                        amount: 30.0,
                        minValue: 10,
                    });
                    const percentualVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    expect(percentualVoucher.apply(100, 15)).toEqual(15);
                });
            });
            describe("and voucher doesnt have minValue", () => {
                it("returns error", () => {
                    const voucher = new entities_1.Voucher({
                        id: 'aad',
                        code: "#F121221",
                        type: "free shipping",
                        amount: 30.0,
                    });
                    const error = new Error("minValue field not found in free shipping voucher");
                    expect(() => AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher)).toThrow(error);
                });
            });
            describe("and subtotal is less than minValue", () => {
                it("returns 0", () => {
                    const voucher = new entities_1.Voucher({
                        id: 'aad',
                        code: "#F121221",
                        type: "free shipping",
                        amount: 30.0,
                        minValue: 150,
                    });
                    const percentualVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    expect(percentualVoucher.apply(100, 15)).toEqual(0);
                });
            });
        });
    });
});
