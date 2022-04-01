"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../src/domain/entities");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeVoucherRepository_1 = require("../../../../support/repositories/FakeVoucherRepository");
describe("Domain :: Factories :: AppliedVoucherFactory", () => {
    describe("#fromVoucher", () => {
        describe("if voucher has percentual type", () => {
            it("returns PercentualVoucher", () => {
                const vouchers = [];
                const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const voucher = new entities_1.Voucher({
                    id: voucherFactory.getNextId(),
                    code: "#F121221",
                    type: "percentual",
                    amount: 30.0,
                });
                const result = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                expect(AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher)).toEqual(result);
            });
        });
        describe("if voucher has fixed type", () => {
            it("returns FixedVoucher", () => {
                const vouchers = [];
                const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const voucher = new entities_1.Voucher({
                    id: voucherFactory.getNextId(),
                    code: "#F121221",
                    type: "fixed",
                    amount: 30.0,
                });
                const result = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                expect(AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher)).toEqual(result);
            });
        });
        describe("if voucher has free shipping type", () => {
            describe("and it has minValue", () => {
                it("returns ShippingVoucher", () => {
                    const vouchers = [];
                    const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const voucher = new entities_1.Voucher({
                        id: voucherFactory.getNextId(),
                        code: "#F121221",
                        type: "free shipping",
                        amount: 30.0,
                        minValue: 20,
                    });
                    const result = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    expect(AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher)).toEqual(result);
                });
            });
            describe("and voucher doesnt have minValue", () => {
                it("returns error", () => {
                    const vouchers = [];
                    const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const voucher = new entities_1.Voucher({
                        id: voucherFactory.getNextId(),
                        code: "#F121221",
                        type: "free shipping",
                        amount: 30.0,
                    });
                    const error = new Error("minValue field not found in free shipping voucher");
                    expect(() => AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher)).toThrow(error);
                });
            });
        });
    });
});
