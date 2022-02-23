import { Cart, Voucher } from "../../../../../src/domain/entities";
import { LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";

describe("Domain :: Entity :: Cart", () => {
  describe("#isFinished", () => {
    describe("when cart has state equals FINISHED", () => {
      it("returns true", () => {
        const lineItems = [
          new LineItem(1, 20, 2),
          new LineItem(2, 40, 1),
        ];
        const voucher = new Voucher({
          id: 1,
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = new Cart({
          id: 1,
          lineItems,
          appliedVoucher,
          state: "FINISHED",
        }
        );

        expect(cart.isFinished()).toEqual(true);
      });
    });
    describe("when cart doesn´t have state equals FINISHED", () => {
      it("returns false", () => {
        const lineItems = [
          new LineItem(1, 20, 2),
          new LineItem(2, 40, 1),
        ];
        const voucher = new Voucher({
          id: 1,
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = new Cart({
          id: 1,
          lineItems,
          appliedVoucher,
          state: "PENDING",
        }
        );

        expect(cart.isFinished()).toEqual(false);
      });
    });
  });
});
