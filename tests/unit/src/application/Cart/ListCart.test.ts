import ListCart from "../../../../../src/application/Cart/ListCart";
import { Cart, Voucher } from "../../../../../src/domain/entities";
import { LineItems, LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";

describe("Application :: Product :: ListCart", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute(1);

          expect(result).toEqual(cart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
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
            state: "CREATED",
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute(1);

          expect(result).toEqual(cart);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem(1, 20, 2),
            new LineItem(2, 40, 1),
          ];
          const cart = new Cart({
            id: 1,
            lineItems,
            state: "PENDING",
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute(1);

          expect(result).toEqual(cart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
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
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute(1);

          expect(result).toEqual(cart);
        });
      });
    });

    describe("When idCart wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [
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
        });
        const carts = [cart];
        const cartRepository = new FakeCartRepository(carts);
        const listCart = new ListCart(cartRepository);

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id 2 can't be found.`;

        await expect(() => listCart.execute(2)).rejects.toThrow(notFoundError);
      });
    });
  });
});
