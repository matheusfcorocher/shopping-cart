import { Voucher } from "../../../../../src/domain/entities";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";

describe("Domain :: Factories :: AppliedVoucherFactory", () => {
  describe("#fromVoucher", () => {
    describe("if voucher has percentual type", () => {
      it("returns PercentualVoucher", () => {
        const voucher = new Voucher({
          id: 1,
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const result = appliedFactory.fromVoucher(voucher);

        expect(appliedFactory.fromVoucher(voucher)).toEqual(result);
      });
    });
    describe("if voucher has fixed type", () => {
      it("returns FixedVoucher", () => {
        const voucher = new Voucher({
          id: 1,
          code: "#F121221",
          type: "fixed",
          amount: 30.0,
        });
        const result = appliedFactory.fromVoucher(voucher);

        expect(appliedFactory.fromVoucher(voucher)).toEqual(result);
      });
    });
    describe("if voucher has free shipping type", () => {
      describe("and it has minValue", () => {
        it("returns ShippingVoucher", () => {
          const voucher = new Voucher({
            id: 1,
            code: "#F121221",
            type: "free shipping",
            amount: 30.0,
            minValue: 20,
          });
          const result = appliedFactory.fromVoucher(voucher);

          expect(appliedFactory.fromVoucher(voucher)).toEqual(result);
        });
      });
      describe("and voucher doesnt have minValue", () => {
        it("returns error", () => {
          const voucher = new Voucher({
            id: 1,
            code: "#F121221",
            type: "free shipping",
            amount: 30.0,
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
