import AddLineItem from "../../../../../src/application/Cart/AddLineItem";
import {
  Buyer,
  Cart,
  Product,
  Voucher,
} from "../../../../../src/domain/entities";
import { LineItems, LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Application :: Cart :: AddLineItem", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "aad",
            buyerId: "aad",
            lineItems,
          });
          const carts = [cart];
          const products = [
            new Product({ id: "aad", name: "foo", price: 20, available: 20 }),
          ];
          const newLineItem = new LineItem("aad", 20, 1);

          const newLineItems = [newLineItem];
          const newCart = new Cart({
            id: "aad",
            buyerId: "aad",
            lineItems: newLineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const result = await addLineItem.execute("aad", "aad");

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
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

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const newLineItem = new LineItem("aaa", 20, 1);
          const newLineItems = [newLineItem];
          const newCart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: newLineItems,
            appliedVoucher,
          });

          const result = await addLineItem.execute("aaa", "aaa");

          expect(result).toEqual(newCart);
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

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const newLineItems = [
            new LineItem("aaa", 20, 3),
            new LineItem("bbb", 40, 1),
          ];
          const newCart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: newLineItems,
          });

          const result = await addLineItem.execute("aaa", "aaa");
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

          const newLineItems = [
            new LineItem("aaa", 20, 3),
            new LineItem("bbb", 40, 1),
          ];
          const newCart = new Cart({
            id: "aaa",
            buyerId: "aaa",
            lineItems: newLineItems,
            appliedVoucher,
          });

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const result = await addLineItem.execute("aaa", "aaa");
          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When buyerId wasn't found", () => {
      it("returns correct cart", async () => {
        const carts: Array<Cart> = [];
        const products = [
          new Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
        ];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const addLineItem = new AddLineItem(cartRepository, productRepository);
        expect(await addLineItem.execute("bbb", "aaa")).toEqual(
          expect.objectContaining(
            {
              id: expect.any(String),
              buyerId: expect.any(String),
              lineItems: [new LineItem("aaa", 20, 1)],
            }
          )
        );
      });
    });
    describe("When update the cart gives error", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [
          new LineItem("aaa", 20, 2),
          new LineItem("bbb", 40, 1),
        ];
        const newLineItem = new LineItem("aaa", 20, 4);
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
        const addLineItem = new AddLineItem(cartRepository, productRepository);

        await expect(() => addLineItem.execute("aaa", "aaa")).rejects.toThrow(
          error
        );
      });
    });
  });
});
