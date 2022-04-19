import RemoveVoucher from "../../../../../src/application/Cart/RemoveVoucher";
import * as Cart from "../../../../../src/domain/entities/Cart";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";

describe("Application :: Cart :: RemoveVoucher", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: Cart.LineItems = [];
          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const newCart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const removeVoucher = new RemoveVoucher(cartRepository);

          const result = await removeVoucher.execute("aaa");

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: Cart.LineItems = [];
          const voucher = Voucher.createVoucher({
            id: "aaa",
            code: "XESBQ",
            type: "fixed",
            amount: createMoney(50),
          });

          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
            appliedVoucher: appliedVoucher,
          });
          const carts = [cart];

          const newCart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const removeVoucher = new RemoveVoucher(cartRepository);

          const result = await removeVoucher.execute("aaa");

          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: Cart.LineItems = [
            Cart.createLineItem({
              productId: "aaa",
              unitPrice: createMoney(20),
              quantity: 2,
            }),
            Cart.createLineItem({
              productId: "bbb",
              unitPrice: createMoney(40),
              quantity: 1,
            }),
          ];
          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];

          const newCart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const removeVoucher = new RemoveVoucher(cartRepository);

          const result = await removeVoucher.execute("aaa");

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: Cart.LineItems = [
            Cart.createLineItem({
              productId: "aaa",
              unitPrice: createMoney(20),
              quantity: 2,
            }),
            Cart.createLineItem({
              productId: "bbb",
              unitPrice: createMoney(40),
              quantity: 1,
            }),
          ];
          const voucher = Voucher.createVoucher({
            id: "aaa",
            code: "XESBQ",
            type: "fixed",
            amount: createMoney(50),
          });

          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
            appliedVoucher: appliedVoucher,
          });
          const carts = [cart];

          const newCart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const removeVoucher = new RemoveVoucher(cartRepository);

          const result = await removeVoucher.execute("aaa");

          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When buyerId wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: Cart.LineItems = [];
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
        });
        const carts = [cart];

        const cartRepository = new FakeCartRepository(carts);
        const removeVoucher = new RemoveVoucher(cartRepository);

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id bbb can't be found.`;

        expect(await removeVoucher.execute("bbb")).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            buyerId: expect.any(String),
            lineItems,
          })
        );
      });
    });

    describe("When update the cart gives error", () => {
      it("returns error", async () => {
        const lineItems: Cart.LineItems = [];
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
        });
        const carts = [cart];

        const error = new Error("Service Unavailable");

        const cartRepository = new FakeCartRepository(carts);
        cartRepository.update = () => {
          throw error;
        };
        const removeVoucher = new RemoveVoucher(cartRepository);

        await expect(() => removeVoucher.execute("aaa")).rejects.toThrow(error);
      });
    });
  });
});
