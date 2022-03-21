import { Cart, Voucher } from "../../../../../../src/domain/entities";
import {
  LineItem,
  LineItems,
} from "../../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../../src/domain/factories/AppliedVoucherFactory";
import { CartModel } from "../../../../../../src/infra/database/knex/models";
import { ObjectionCartRepository } from "../../../../../../src/infra/repositories/cart/ObjectionCartRepository";
import BuyerModelFactory from "../../../../../support/factories/models/BuyerModelFactory";
import CartModelFactory from "../../../../../support/factories/models/CartModelFactory";
import LineItemModelFactory from "../../../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../../../support/factories/models/ProductModelFactory";
import VoucherModelFactory from "../../../../../support/factories/models/VoucherModelFactory";

const { setupIntegrationTest } = require("../../../../../support/setup");
const cartRepository = new ObjectionCartRepository();

describe("Infra :: Cart :: ObjectionCartRepository", () => {
  setupIntegrationTest();
  beforeEach(async () => {
    await ProductModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        name: "Gaming Keyboard",
        price: 79.99,
        available: 30,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        name: "Gaming Chair",
        price: 299.99,
        available: 30,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        name: "Gaming Mouse",
        price: 39.99,
        available: 30,
      },
    ]);
    await LineItemModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        unitPrice: 69.99,
        quantity: 2,
        ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        ownerType: "cart",
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        unitPrice: 299.99,
        quantity: 2,
        ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        ownerType: "cart",
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        unitPrice: 39.99,
        quantity: 2,
        ownerId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        ownerType: "cart",
      },
    ]);
    await BuyerModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        name: "Matheus",
        birthDate: new Date(1999, 8, 2),
        email: "matheus@gmail.com",
        postalCode: "142005-203",
        street: "Rua do teste",
        district: "Bairro do teste",
        city: "Piracicaba",
        country: "Brazil",
      },
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
        name: "Matheus",
        birthDate: new Date(1999, 8, 2),
        email: "matheus2@gmail.com",
        postalCode: "142005-201",
        street: "Rua do teste",
        district: "Bairro do teste",
        city: "Piracicaba",
        country: "Brazil",
      },
    ]);
    await VoucherModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        code: "TEST1",
        type: "percentual",
        amount: 40,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        code: "TEST2",
        type: "fixed",
        amount: 40,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        code: "TEST3",
        type: "free shipping",
        amount: 2,
        minValue: 50,
      },
    ]);
    await CartModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        type: "fixed",
        amount: 50,
      },
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
      },
    ]);
  });

  describe("#delete", () => {
    describe("when cart doesnt have any lineItems", () => {
      describe("deletes cart from database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });
          await cartRepository.delete(cart);
          expect((await CartModel.query()).length).toBe(1);
        });
      });
      describe("return success message", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });

          expect(await cartRepository.delete(cart)).toEqual(
            "Cart was deleted successfully."
          );
        });
      });
    });
    describe("when cart has lineItems", () => {
      describe("deletes cart from database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: 40,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          await cartRepository.delete(cart);
          expect((await CartModel.query()).length).toBe(1);
        });
      });
      describe("return success message", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: 40,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });

          expect(await cartRepository.delete(cart)).toEqual(
            "Cart was deleted successfully."
          );
        });
      });
    });
    describe("when try to delete cart", () => {
      describe("but service is unavailable", () => {
        it("returns error", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });
          const error = new Error("Service Unavailable");
          cartRepository.delete = () => Promise.reject(error);

          await expect(() => cartRepository.delete(cart)).rejects.toThrow(
            error
          );
        });
      });
      describe("but cart isn't found", () => {
        it("returns not found error", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Cart with id ${cart.id} and buyerId ${cart.buyerId} can't be found.`;
          cartRepository.delete = () => Promise.reject(notFoundError);

          await expect(() => cartRepository.delete(cart)).rejects.toThrow(
            notFoundError
          );
        });
      });
      describe("but lineItem isn't found", () => {
        it("returns not found error", async () => {
          const lineItems: LineItems = [
            new LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs", 69.99, 2),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: 40,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId 7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf and productId 7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs can't be found for cart.`;
          cartRepository.delete = () => Promise.reject(notFoundError);

          await expect(() => cartRepository.delete(cart)).rejects.toThrow(
            notFoundError
          );
        });
      });
    });
  });

  describe("#getAllCarts", () => {
    describe("When method is called", () => {
      describe("result is a array instance of lineItems", () => {
        it("returns correct result", async () => {
          const carts = await cartRepository.getAllCarts();

          expect(carts[0]).toBeInstanceOf(Cart);
        });
      });
      describe("result has correct length", () => {
        it("returns correct result", async () => {
          const carts = await cartRepository.getAllCarts();

          expect(carts.length).toBe(2);
        });
      });
      describe("result returns correct array", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const lineItems2: LineItems = [
            new LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "fixed",
            amount: 50,
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const expected = [
            new Cart({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              lineItems,
            }),
            new Cart({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              lineItems: lineItems2,
              appliedVoucher,
            }),
          ];
          const carts = await cartRepository.getAllCarts();

          expect(carts).toEqual(expect.arrayContaining(expected));
        });
      });
    });
    describe("When service is unavailable", () => {
      it("returns error", async () => {
        const error = new Error("Service Unavailable");
        cartRepository.getAllCarts = () => Promise.reject(error);

        await expect(() => cartRepository.getAllCarts()).rejects.toThrow(error);
      });
    });
  });

  describe("#getCartById", () => {
    describe("when execute method", () => {
      describe("and cart is found", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });

          expect(await cartRepository.getCartById(cart.id)).toEqual(cart);
        });
      });
    });
    describe("when try to get cart by id", () => {
      describe("but cart isn't found", () => {
        it("returns not found error", async () => {
          const cardId = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Cart with id ${cardId} can't be found.`;
          cartRepository.delete = () => Promise.reject(notFoundError);

          await expect(() =>
            cartRepository.getCartById(cardId)
          ).rejects.toThrow(notFoundError);
        });
      });
    });
  });
});
