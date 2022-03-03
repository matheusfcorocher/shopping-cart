import ListCart from "../../../../../src/application/Cart/ListCart";
import { Cart, Voucher } from "../../../../../src/domain/entities";
import { LineItems, LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";

describe("Application :: Cart :: ListCart", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: 'aaa',
            lineItems,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const voucher = new Voucher({
            id: 'aaa',
            code: "#F121221",
            type: "percentual",
            amount: 30.0,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: 'aaa',
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem('aaa', 20, 2),
            new LineItem('bbb', 40, 1),
          ];
          const cart = new Cart({
            id: 'aaa',
            lineItems,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem('aaa', 20, 2),
            new LineItem('bbb', 40, 1),
          ];
          const voucher = new Voucher({
            id: 'aaa',
            code: "#F121221",
            type: "percentual",
            amount: 30.0,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: 'aaa',
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const listCart = new ListCart(cartRepository);

          const result = await listCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
    });

    describe("When idCart wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [
          new LineItem('aaa', 20, 2),
          new LineItem('bbb', 40, 1),
        ];
        const voucher = new Voucher({
          id: 'aaa',
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = new Cart({
          id: 'aaa',
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const cartRepository = new FakeCartRepository(carts);
        const listCart = new ListCart(cartRepository);

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id bbb can't be found.`;

        await expect(() => listCart.execute('bbb')).rejects.toThrow(notFoundError);
      });
    });
  });
});
