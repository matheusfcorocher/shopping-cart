import { Cart, Voucher } from "../../../../../../src/domain/entities";
import {
  LineItem,
  LineItems,
} from "../../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../../src/domain/factories/AppliedVoucherFactory";
import { CartModel } from "../../../../../../src/infra/database/knex/models/CartModel";
import { LineItemModel } from "../../../../../../src/infra/database/knex/models/LineItemModel";
import ObjectionCartRepository from "../../../../../../src/infra/repositories/cart/ObjectionCartRepository";
import { ObjectionLineItemMapper } from "../../../../../../src/infra/repositories/lineItem/ObjectionLineItemMapper";
import { ObjectionCartMapper } from "../../../../../../src/infra/repositories/cart/ObjectionCartMapper";
import BuyerModelFactory from "../../../../../support/factories/models/BuyerModelFactory";
import CartModelFactory from "../../../../../support/factories/models/CartModelFactory";
import LineItemModelFactory from "../../../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../../../support/factories/models/ProductModelFactory";
import VoucherModelFactory from "../../../../../support/factories/models/VoucherModelFactory";
import mockModel from "../../../../../support/objection";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import { InfrastructureError } from "../../../../../../src/lib/CustomError";

const { setupIntegrationTest } = require("../../../../../support/setup");
const cartRepository = new ObjectionCartRepository();

// jest.mock("../../../../../../src/infra/database/knex/models/CartModel");

describe("Infra :: Cart :: ObjectionCartRepository", () => {
  setupIntegrationTest();
  beforeEach(async () => {
    await ProductModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        name: "Gaming Keyboard",
        price: 7999,
        available: 30,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        name: "Gaming Chair",
        price: 29999,
        available: 30,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        name: "Gaming Mouse",
        price: 3999,
        available: 30,
      },
    ]);
    await LineItemModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        unitPrice: 6999,
        quantity: 2,
        ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        ownerType: "cart",
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        unitPrice: 29999,
        quantity: 2,
        ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        ownerType: "cart",
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        unitPrice: 3999,
        quantity: 2,
        ownerId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        ownerType: "cart",
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36fff",
        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        unitPrice: 6999,
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
        amount: 4000,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        code: "TEST2",
        type: "fixed",
        amount: 4000,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        code: "TEST3",
        type: "free shipping",
        amount: 2,
        minValue: 5000,
      },
    ]);
    await CartModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        type: "fixed",
        amount: 5000,
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
      describe("deletes lineItems from database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          await cartRepository.delete(cart);
          expect((await LineItemModel.query()).length).toBe(3);
        });
      });
      describe("deletes cart from database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
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
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
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
      describe("but cart isn't found", () => {
        it("returns not found error", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Cart with id ${cart.id} can't be found.`;

          await expect(() => cartRepository.delete(cart)).rejects.toThrow(
            notFoundError
          );
        });
      });
      describe("but lineItem isn't found", () => {
        it("returns not found error", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `LineItems can't be found.`;

          await expect(() => cartRepository.delete(cart)).rejects.toThrow(
            notFoundError
          );
        });
      });
      describe("but some operation fail", () => {
        it("database back to initial state by transaction", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "fixed",
            amount: createMoney(5000),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          const error = new Error("Service Unavailable");
          mockModel(CartModel).reject(error);
          try {
            await cartRepository.delete(cart);
          } catch {}
          jest.restoreAllMocks();

          expect(
            JSON.stringify(
              await cartRepository.getCartById(
                "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf"
              )
            )
          ).toEqual(JSON.stringify(cart));
        });
      });
    });
  });

  describe("#getAllCarts", () => {
    describe("When method is called", () => {
      describe("result is a array instance of cart", () => {
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
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "fixed",
            amount: createMoney(5000),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const expected = [
            new Cart({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              lineItems: lineItems2,
              appliedVoucher,
            }),
            new Cart({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              lineItems,
            }),
          ];
          const carts = await cartRepository.getAllCarts();

          expect(
            JSON.stringify(
              carts.sort((a: Cart, b: Cart) => a.id.localeCompare(b.id))
            )
          ).toEqual(
            JSON.stringify(
              expected.sort((a: Cart, b: Cart) => a.id.localeCompare(b.id))
            )
          );
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
          notFoundError.message = `Couldn't find cart with id: ${cardId} in database. Verify if you are passing the correct id.`;
          cartRepository.delete = () => Promise.reject(notFoundError);

          await expect(() =>
            cartRepository.getCartById(cardId)
          ).rejects.toThrow(notFoundError);
        });
      });
    });
  });

  describe("#getCartByBuyerId", () => {
    describe("when execute method", () => {
      describe("and cart is found", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });

          expect(await cartRepository.getCartByBuyerId(cart.buyerId!)).toEqual(
            cart
          );
        });
      });
    });
    describe("when try to get cart by id", () => {
      describe("but cart isn't found", () => {
        it("returns not found error", async () => {
          const buyerId = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs";
          const notFoundError = new InfrastructureError({
            title: "Not Found Error",
            code: "NOTFOUND_ERROR",
            message: `Couldn't find cart with buyerId: ${buyerId} in database. Verify if you are passing the correct buyerId.`,
            detail: "",
            // stack: err.stack,
          });
          cartRepository.delete = () => Promise.reject(notFoundError);

          await expect(() =>
            cartRepository.getCartByBuyerId(buyerId)
          ).rejects.toThrow(notFoundError);
        });
      });
    });
  });

  describe("#update", () => {
    describe("when cart doesnt have any lineItems", () => {
      describe("return success message", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });

          expect(await cartRepository.update(cart)).toEqual(cart);
        });
      });
    });
    describe("when cart has lineItems", () => {
      describe("delete lineItem from database when quantity is 0", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          await cartRepository.update(cart);

          expect(
            (
              await LineItemModel.query().where({
                ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                ownerType: "cart",
                productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              })
            ).length
          ).toBe(0);
        });
      });
      describe("update lineItem from database when quantity > 0", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              4
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });
          await cartRepository.update(cart);

          expect(
            JSON.stringify(
              await LineItemModel.query()
                .findOne({
                  ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                  ownerType: "cart",
                  productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                })
                .then((data) => ObjectionLineItemMapper.toEntity(data!))
            )
          ).toEqual(JSON.stringify(lineItems[0]));
        });
      });
      describe("store lineItem in database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "8bc94226-3e20-40cb-a507-554fabf36ffa",
              createMoney(3999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
            appliedVoucher,
          });
          await cartRepository.update(cart);

          expect(
            JSON.stringify(
              await LineItemModel.query()
                .findOne({
                  ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                  ownerType: "cart",
                  productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                })
                .then((data) => {
                  return ObjectionLineItemMapper.toEntity(data!);
                })
            )
          ).toEqual(JSON.stringify(lineItems[0]));
        });
      });
      describe("update cart from database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });

          await cartRepository.update(cart);

          expect(
            await CartModel.query()
              .findOne({
                uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              })
              .then((d) =>
                ObjectionCartMapper.toEntity(d!, { lineItems, appliedVoucher })
              )
          ).toEqual(cart);
        });
      });
      describe("return success message", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              createMoney(6999),
              2
            ),
          ];
          const voucher = new Voucher({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: createMoney(40),
          });
          const appliedVoucher = appliedFactory.fromVoucher(voucher);
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems,
            appliedVoucher,
          });

          expect(JSON.stringify(await cartRepository.update(cart))).toEqual(
            JSON.stringify(cart)
          );
        });
      });
    });
    describe("when try update cart", () => {
      describe("but some operation fail", () => {
        it("database back to initial state by transaction", async () => {
          const lineItems: LineItems = [
            new LineItem(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              createMoney(6999),
              2
            ),
          ];
          const cart = new Cart({
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
          });
          const error = new Error("Service Unavailable");
          mockModel(CartModel).reject(error);
          try {
            await cartRepository.update(cart);
          } catch {}
          jest.restoreAllMocks();
          expect(
            await cartRepository.getCartById(
              "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd"
            )
          ).not.toEqual(cart);
        });
      });
    });
  });
});
