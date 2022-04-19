import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Domain :: Factories :: AppliedVoucherFactory", () => {
  describe("#fromVoucher", () => {
    describe("if voucher has percentual type", () => {
      it("returns PercentualVoucher", () => {
        const vouchers : Array<Voucher.Voucher> = [];
        const voucherFactory = new FakeVoucherRepository(vouchers);
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "#F121221",
          type: "percentual",
          amount: createMoney(30.0),
        });
        const result = appliedFactory.fromVoucher(voucher);

        expect(appliedFactory.fromVoucher(voucher)).toEqual(result);
      });
    });
    describe("if voucher has fixed type", () => {
      it("returns FixedVoucher", () => {
        const vouchers : Array<Voucher.Voucher> = [];
        const voucherFactory = new FakeVoucherRepository(vouchers);
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "#F121221",
          type: "fixed",
          amount: createMoney(30.0),
        });
        const result = appliedFactory.fromVoucher(voucher);

        expect(appliedFactory.fromVoucher(voucher)).toEqual(result);
      });
    });
    describe("if voucher has free shipping type", () => {
      describe("and it has minValue", () => {
        it("returns ShippingVoucher", () => {
          const vouchers : Array<Voucher.Voucher> = [];
          const voucherFactory = new FakeVoucherRepository(vouchers);   
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "#F121221",
            type: "free shipping",
            amount: createMoney(30.0),
            minValue: createMoney(20),
          });
          const result = appliedFactory.fromVoucher(voucher);

          expect(appliedFactory.fromVoucher(voucher)).toEqual(result);
        });
      });
      describe("and voucher doesnt have minValue", () => {
        it("returns error", () => {
          const vouchers : Array<Voucher.Voucher> = [];
          const voucherFactory = new FakeVoucherRepository(vouchers);
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "#F121221",
            type: "free shipping",
            amount: createMoney(30.0),
          });
          const error = new Error(
            "minValue field not found in free shipping voucher"
          );

          expect(() => appliedFactory.fromVoucher(voucher)).toThrow(error);
        });
      });
    });
  });
});
