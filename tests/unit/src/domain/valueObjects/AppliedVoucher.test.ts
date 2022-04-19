import * as AppliedVoucher from "../../../../../src/domain/valueObjects/AppliedVoucher";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";

describe("Domain :: ValueObjects :: AppliedVoucher", () => {
  describe("#apply", () => {
    describe("if voucher has percentual type", () => {
      it("returns correct value", () => {
        const voucher = Voucher.createVoucher({
          id: "aad",
          code: "#F121221",
          type: "percentual",
          amount: createMoney(30),
        });
        const percentualVoucher = appliedFactory.fromVoucher(voucher);

        expect(
          JSON.stringify(
            AppliedVoucher.applyDiscount({
              subtotal: createMoney(1000),
              shipping: createMoney(1500),
              appliedVoucher: percentualVoucher,
            })
          )
        ).toEqual(JSON.stringify(createMoney(300)));
      });
    });
    describe("if voucher has fixed type", () => {
      it("returns correct value", () => {
        const voucher = Voucher.createVoucher({
          id: "aad",
          code: "#F121221",
          type: "fixed",
          amount: createMoney(3000),
        });
        const fixedVoucher = appliedFactory.fromVoucher(voucher);

        expect(
          JSON.stringify(
            AppliedVoucher.applyDiscount({
              subtotal: createMoney(1000),
              shipping: createMoney(3000),
              appliedVoucher: fixedVoucher,
            })
          )
        ).toEqual(JSON.stringify(fixedVoucher.amount));
      });
    });
    describe("if voucher has free shipping type", () => {
      describe("and subtotal is equal or more than minValue", () => {
        it("returns correct value", () => {
          const voucher = Voucher.createVoucher({
            id: "aad",
            code: "#F121221",
            type: "free shipping",
            amount: createMoney(3000),
            minValue: createMoney(1000),
          });
          const freeShippingVoucher = appliedFactory.fromVoucher(voucher);

          expect(
            JSON.stringify(
              AppliedVoucher.applyDiscount({
                subtotal: createMoney(3000),
                shipping: createMoney(1000),
                appliedVoucher: freeShippingVoucher,
              })
            )
          ).toEqual(JSON.stringify(createMoney(1000)));
        });
      });
      describe("and voucher doesnt have minValue", () => {
        it("returns error", () => {
          const voucher = Voucher.createVoucher({
            id: "aad",
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
      describe("and subtotal is less than minValue", () => {
        it("returns 0", () => {
          const voucher = Voucher.createVoucher({
            id: "aad",
            code: "#F121221",
            type: "free shipping",
            amount: createMoney(3000),
            minValue: createMoney(1500),
          });
          const freeShippingVoucher = appliedFactory.fromVoucher(voucher);
          const expected = createMoney(0);

          expect(
            JSON.stringify(
              AppliedVoucher.applyDiscount({
                subtotal: createMoney(1000),
                shipping: createMoney(1500),
                appliedVoucher: freeShippingVoucher,
              })
            )
          ).toEqual(JSON.stringify(expected));
        });
      });
    });
  });
});
