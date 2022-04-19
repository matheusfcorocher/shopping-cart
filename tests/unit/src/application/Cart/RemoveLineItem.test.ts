import RemoveLineItem from "../../../../../src/application/Cart/RemoveLineItem";
import * as Cart from "../../../../../src/domain/entities/Cart";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import * as Product from "../../../../../src/domain/entities/Product";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Application :: Cart :: RemoveLineItem", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns not found error", async () => {
          const lineItems: Cart.LineItems = [];
          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const removeItem = Cart.createLineItem({
            productId: "aaa",
            unitPrice: createMoney(20),
            quantity: 1,
          });
          const products = [
            Product.createProduct({
              id: "aaa",
              name: "foo",
              price: createMoney(20),
              available: 20,
            }),
          ];
          const removeItems = [removeItem];
          const newCart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: removeItems,
          });
          const error = new Error(
            "Item with productId aaa wasn't found in cart!"
          );

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
          const lineItems: Cart.LineItems = [];
          const voucher = Voucher.createVoucher({
            id: "aaa",
            code: "#F121221",
            type: "percentual",
            amount: createMoney(30.0),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const products = [
            Product.createProduct({
              id: "aaa",
              name: "foo",
              price: createMoney(20),
              available: 20,
            }),
          ];

          const error = new Error(
            "Item with productId aaa wasn't found in cart!"
          );

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
          const products = [
            Product.createProduct({
              id: "aaa",
              name: "foo",
              price: createMoney(20),
              available: 20,
            }),
          ];

          const removeItems = [
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
          const newCart = Cart.createCart({
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
          expect(JSON.stringify(result)).toEqual(JSON.stringify(newCart));
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
            code: "#F121221",
            type: "percentual",
            amount: createMoney(30.0),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = Cart.createCart({
            id: "aaa",
            buyerId: "aaa",
            lineItems,
            appliedVoucher,
          });
          const carts = [cart];
          const products = [
            Product.createProduct({
              id: "aaa",
              name: "foo",
              price: createMoney(20),
              available: 20,
            }),
          ];

          const removeItems = [
            Cart.createLineItem({
              productId: "aaa",
              unitPrice: createMoney(20),
              quantity: 1,
            }),
            Cart.createLineItem({
              productId: "bbb",
              unitPrice: createMoney(40),
              quantity: 1,
            }),
          ];
          const newCart = Cart.createCart({
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
          expect(JSON.stringify(result)).toEqual(JSON.stringify(newCart));
        });
      });
    });

    describe("When buyerId wasn't found", () => {
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
          code: "#F121221",
          type: "percentual",
          amount: createMoney(30.0),
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const products = [
          Product.createProduct({
            id: "aaa",
            name: "foo",
            price: createMoney(20),
            available: 20,
          }),
          Product.createProduct({
            id: "bbb",
            name: "pie",
            price: createMoney(20),
            available: 20,
          }),
        ];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const removeLineItem = new RemoveLineItem(
          cartRepository,
          productRepository
        );

        const error = new Error(
          "Item with productId aaa wasn't found in cart!"
        );

        await expect(() =>
          removeLineItem.execute("bbb", "aaa")
        ).rejects.toThrow(error);
      });
    });

    describe("When productId wasn't found", () => {
      it("returns not found error", async () => {
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
          code: "#F121221",
          type: "percentual",
          amount: createMoney(30.0),
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const products = [
          Product.createProduct({
            id: "bbb",
            name: "foo",
            price: createMoney(20),
            available: 20,
          }),
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
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({productId: "aaa", unitPrice: createMoney(20), quantity: 2}),
            Cart.createLineItem({productId: "bbb", unitPrice: createMoney(40), quantity: 1}),
        ];
        const removeItem = Cart.createLineItem({productId: "aaa", unitPrice: createMoney(20), quantity: 4});
        const voucher = Voucher.createVoucher({
          id: "aaa",
          code: "#F121221",
          type: "percentual",
          amount: createMoney(30.0),
        });
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher,
        });
        const carts = [cart];
        const products = [
          Product.createProduct({
            id: "aaa",
            name: "foo",
            price: createMoney(20),
            available: 20,
          }),
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
