import RemoveLineItem from "../../../../../src/application/Cart/RemoveLineItem";
import { Cart, Product, Voucher } from "../../../../../src/domain/entities";
import { LineItems, LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Application :: Cart :: RemoveLineItem", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns not found error", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const removeItem = new LineItem("aaa", 20, 1);
          const products = [
            new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
          ];
          const removeItems = [removeItem];
          const newCart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: removeItems,
          });
          const error = new Error("Item with productId aaa wasn't found in cart!");

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const removeLineItem = new RemoveLineItem(
            cartRepository,
            productRepository
          );

          await expect(() =>
            removeLineItem.execute("aaa", "aaa")
          ).rejects.toThrow(error);
        });
      });
      describe("and cart has voucher", () => {
        it("returns not found error", async () => {
          const lineItems: LineItems = [];
          const voucher = new Voucher({
            id: "aaa",
            code: "#F121221",
            type: "percentual",
            amount: 30.0,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const products = [
            new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
          ];

          const error = new Error("Item with productId aaa wasn't found in cart!");

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const removeLineItem = new RemoveLineItem(
            cartRepository,
            productRepository
          );

          await expect(() =>
            removeLineItem.execute("aaa", "aaa")
          ).rejects.toThrow(error);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem("aaa", 20, 2),
            new LineItem("bbb", 40, 1),
          ];
          const cart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const products = [
            new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
          ];

          const removeItems = [
            new LineItem("aaa", 20, 1),
            new LineItem("bbb", 40, 1),
          ];
          const newCart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: removeItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const removeLineItem = new RemoveLineItem(
            cartRepository,
            productRepository
          );

          const result = await removeLineItem.execute("aaa", "aaa");
          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem("aaa", 20, 2),
            new LineItem("bbb", 40, 1),
          ];
          const voucher = new Voucher({
            id: "aaa",
            code: "#F121221",
            type: "percentual",
            amount: 30.0,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const products = [
            new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
          ];

          const removeItems = [
            new LineItem("aaa", 20, 1),
            new LineItem("bbb", 40, 1),
          ];
          const newCart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: removeItems,
            appliedVoucher,
          });

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const removeLineItem = new RemoveLineItem(
            cartRepository,
            productRepository
          );

          const result = await removeLineItem.execute("aaa", "aaa");
          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When buyerId wasn't found", () => {
      it("returns correct cart", async () => {
        const lineItems: LineItems = [
          new LineItem("aaa", 20, 2),
          new LineItem("bbb", 40, 1),
        ];
        const voucher = new Voucher({
          id: "aaa",
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = new Cart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const products = [
          new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
          new Product({ id: "bbb", name: "pie", price: 20, available: 20 }),
        ];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const removeLineItem = new RemoveLineItem(
          cartRepository,
          productRepository
        );

        const error = new Error("Item with productId aaa wasn't found in cart!")

        await expect(() => removeLineItem.execute("bbb", "aaa")).rejects.toThrow(error);
      });
    });

    describe("When productId wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [
          new LineItem("aaa", 20, 2),
          new LineItem("bbb", 40, 1),
        ];
        const voucher = new Voucher({
          id: "aaa",
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = new Cart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const products = [
          new Product({ id: "bbb", name: "foo", price: 20, available: 20 }),
        ];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const removeLineItem = new RemoveLineItem(
          cartRepository,
          productRepository
        );

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Product with id aaa can't be found.`;

        await expect(() =>
          removeLineItem.execute("aaa", "aaa")
        ).rejects.toThrow(notFoundError);
      });
    });

    describe("When update the cart gives error", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [
          new LineItem("aaa", 20, 2),
          new LineItem("bbb", 40, 1),
        ];
        const removeItem = new LineItem("aaa", 20, 4);
        const voucher = new Voucher({
          id: "aaa",
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = new Cart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const products = [
          new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
        ];
        const cartRepository = new FakeCartRepository(carts);
        const error = new Error("Service Unavailable");
        cartRepository.update = () => {
          throw error;
        };
        const productRepository = new FakeProductRepository(products);
        const removeLineItem = new RemoveLineItem(
          cartRepository,
          productRepository
        );

        await expect(() =>
          removeLineItem.execute("aaa", "aaa")
        ).rejects.toThrow(error);
      });
    });
  });
});
