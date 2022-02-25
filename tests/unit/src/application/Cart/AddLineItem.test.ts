import AddLineItem from "../../../../../src/application/Cart/AddLineItem";
import { Cart, Product, Voucher } from "../../../../../src/domain/entities";
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
            id: 1,
            lineItems,
            state: "CREATED",
          });
          const carts = [cart];
          const products = [
            new Product({ id: 1, name: "foo", price: 20, available: 20 }),
          ];
          const newLineItem = new LineItem(1, 20, 1);

          const newLineItems = [newLineItem];
          const newCart = new Cart({
            id: 1,
            lineItems: newLineItems,
            state: "CREATED",
          });

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const result = await addLineItem.execute(1, 1);

          expect(result).toEqual(newCart);
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

          const products = [
            new Product({ id: 1, name: "foo", price: 20, available: 20 }),
          ];

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const newLineItem = new LineItem(1, 20, 1);
          const newLineItems = [newLineItem];
          const newCart = new Cart({
            id: 1,
            lineItems: newLineItems,
            appliedVoucher,
            state: "CREATED",
          });

          const result = await addLineItem.execute(1, 1);

          expect(result).toEqual(newCart);
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
            state: "CREATED",
          });
          const carts = [cart];

          const products = [
            new Product({ id: 1, name: "foo", price: 20, available: 20 }),
          ];

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const newLineItems = [new LineItem(1, 20, 3), new LineItem(2, 40, 1)];
          const newCart = new Cart({
            id: 1,
            lineItems: newLineItems,
            state: "CREATED",
          });

          const result = await addLineItem.execute(1, 1);
          expect(result).toEqual(newCart);
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
            state: "CREATED",
          });
          const carts = [cart];
          const products = [
            new Product({ id: 1, name: "foo", price: 20, available: 20 }),
          ];

          const newLineItems = [new LineItem(1, 20, 3), new LineItem(2, 40, 1)];
          const newCart = new Cart({
            id: 1,
            lineItems: newLineItems,
            appliedVoucher,
            state: "CREATED",
          });

          const cartRepository = new FakeCartRepository(carts);
          const productRepository = new FakeProductRepository(products);
          const addLineItem = new AddLineItem(
            cartRepository,
            productRepository
          );

          const result = await addLineItem.execute(1, 1);
          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When idCart wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [
          new LineItem(1, 20, 2),
          new LineItem(2, 40, 1),
        ];
        const newLineItem = new LineItem(1, 20, 4);
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
        const products = [
          new Product({ id: 1, name: "foo", price: 20, available: 20 }),
        ];
        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const addLineItem = new AddLineItem(cartRepository, productRepository);

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id 2 can't be found.`;

        await expect(() => addLineItem.execute(2, 1)).rejects.toThrow(
          notFoundError
        );
      });
    });
    describe("When update the cart gives error", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [
          new LineItem(1, 20, 2),
          new LineItem(2, 40, 1),
        ];
        const newLineItem = new LineItem(1, 20, 4);
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
        const products = [
          new Product({ id: 1, name: "foo", price: 20, available: 20 }),
        ];
        const cartRepository = new FakeCartRepository(carts);
        const error = new Error("Service Unavailable");
        cartRepository.update = () => {
          throw error;
        };
        const productRepository = new FakeProductRepository(products);
        const addLineItem = new AddLineItem(cartRepository, productRepository);

        await expect(() => addLineItem.execute(1, 1)).rejects.toThrow(
          error
        );
      });
    });
  });
});