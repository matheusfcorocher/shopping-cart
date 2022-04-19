import GetCurrentCart from "../../../../../src/application/Cart/GetCurrentCart";
import * as Cart from "../../../../../src/domain/entities/Cart";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { LineItems, LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";

describe("Application :: Cart :: GetCurrentCart", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const cart = Cart.createCart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const getCurrentCart = new GetCurrentCart(cartRepository);

          const result = await getCurrentCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const voucher = Voucher.createVoucher({
            id: 'aaa',
            code: "#F121221",
            type: "percentual",
            amount: createMoney(30.0),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = Cart.createCart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const getCurrentCart = new GetCurrentCart(cartRepository);

          const result = await getCurrentCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            Cart.createLineItem({productId: "aaa", unitPrice: createMoney(20), quantity: 2}),
            Cart.createLineItem({productId: 'bbb', unitPrice: createMoney(40), quantity: 1}),
          ];
          const cart = Cart.createCart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const getCurrentCart = new GetCurrentCart(cartRepository);

          const result = await getCurrentCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            Cart.createLineItem({productId: "aaa", unitPrice: createMoney(20), quantity: 2}),
            Cart.createLineItem({productId: 'bbb', unitPrice: createMoney(40), quantity: 1}),
          ];
          const voucher = Voucher.createVoucher({
            id: 'aaa',
            code: "#F121221",
            type: "percentual",
            amount: createMoney(30.0),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = Cart.createCart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const cartRepository = new FakeCartRepository(carts);
          const getCurrentCart = new GetCurrentCart(cartRepository);

          const result = await getCurrentCart.execute('aaa');

          expect(result).toEqual(cart);
        });
      });
    });

    describe("When buyerId wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [
          Cart.createLineItem({productId: "aaa", unitPrice: createMoney(20), quantity: 2}),
          Cart.createLineItem({productId: 'bbb', unitPrice: createMoney(40), quantity: 1}),
        ];
        const voucher = Voucher.createVoucher({
          id: 'aaa',
          code: "#F121221",
          type: "percentual",
          amount: createMoney(30.0),
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = Cart.createCart({
          id: 'aaa',
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const cartRepository = new FakeCartRepository(carts);
        const getCurrentCart = new GetCurrentCart(cartRepository);

        expect(await getCurrentCart.execute('bbb')).toEqual(
          expect.objectContaining(
            {
              id: expect.any(String),
              buyerId: expect.any(String),
              lineItems: []
            }
          )
        );
      });
    });
  });
});
