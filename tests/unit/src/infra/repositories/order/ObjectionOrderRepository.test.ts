import { Order } from "../../../../../../src/domain/entities";
import {
  LineItem,
  LineItems,
} from "../../../../../../src/domain/entities/Cart";
import { LineItemModel } from "../../../../../../src/infra/database/knex/models/LineItemModel";
import { ObjectionLineItemMapper } from "../../../../../../src/infra/repositories/lineItem/ObjectionLineItemMapper";
import BuyerModelFactory from "../../../../../support/factories/models/BuyerModelFactory";
import LineItemModelFactory from "../../../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../../../support/factories/models/ProductModelFactory";
import mockModel from "../../../../../support/objection";
import OrderModelFactory from "../../../../../support/factories/models/OrderModelFactory";
import ObjectionOrderRepository from "../../../../../../src/infra/repositories/order/ObjectionOrderRepository";
import { OrderModel } from "../../../../../../src/infra/database/knex/models/OrderModel";
import { ObjectionOrderMapper } from "../../../../../../src/infra/repositories/order/ObjectionOrderMapper";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";

const { setupIntegrationTest } = require("../../../../../support/setup");
const orderRepository = new ObjectionOrderRepository();

// jest.mock("../../../../../../src/infra/database/knex/models/OrderModel");

describe("Infra :: Order :: ObjectionOrderRepository", () => {
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
        ownerType: "order",
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
    await OrderModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        discount: 5000,
        paymentMethod: "debit card",
      },
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
        discount: 0,
        paymentMethod: "pix",
      },
    ]);
  });

  describe("#getAllOrders", () => {
    describe("When method is called", () => {
      describe("result is a array instance of order", () => {
        it("returns correct result", async () => {
          const orders = await orderRepository.getAllOrders();

          expect(orders[0]).toBeInstanceOf(Order);
        });
      });
      describe("result has correct length", () => {
        it("returns correct result", async () => {
          const orders = await orderRepository.getAllOrders();

          expect(orders.length).toBe(2);
        });
      });
      describe("result returns correct array", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const lineItems2: LineItems = [
            new LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", createMoney(6999), 2),
          ];

          const expected = [
            new Order({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              lineItems: lineItems2,
              discount: createMoney(5000),
              paymentMethod: "debit card",
            }),
            new Order({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
              lineItems,
              discount: createMoney(0),
              paymentMethod: "pix",
            }),
          ];
          const orders = await orderRepository.getAllOrders();

          expect(JSON.stringify(orders)).toEqual(JSON.stringify(expected));
        });
      });
    });
    describe("When service is unavailable", () => {
      it("returns error", async () => {
        const error = new Error("Service Unavailable");
        mockModel(OrderModel).reject(error);

        await expect(() => orderRepository.getAllOrders()).rejects.toThrow(
          error
        );
        jest.restoreAllMocks();
      });
    });
  });

  describe("#store", () => {
    describe("when order doesnt have any lineItems", () => {
      describe("return success message", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [];
          const order = new Order({
            id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
            discount: createMoney(0),
            paymentMethod: "pix",
          });

          expect(await orderRepository.store(order)).toEqual(
            "Order was created successfully!"
          );
        });
      });
    });
    describe("when order has lineItems", () => {
      describe("store order in database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", createMoney(27999), 2),
          ];
          const order = new Order({
            id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
            discount: createMoney(0),
            paymentMethod: "pix",
          });
          await orderRepository.store(order);

          expect(
            JSON.stringify(await OrderModel.query()
              .findOne({
                uuid: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
              })
              .then((d) => ObjectionOrderMapper.toEntity(d!, lineItems)))
          ).toEqual(JSON.stringify(order));
        });
      });
      describe("store lineItem in database", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", createMoney(27999), 2),
          ];
          const order = new Order({
            id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
            discount: createMoney(0),
            paymentMethod: "pix",
          });
          await orderRepository.store(order);

          expect(
            JSON.stringify(await LineItemModel.query()
              .findOne({
                ownerId: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                ownerType: "order",
                productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
              })
              .then((data) => ObjectionLineItemMapper.toEntity(data!)))
          ).toEqual(JSON.stringify(lineItems[0]));
        });
      });
      describe("return success message", () => {
        it("returns correct result", async () => {
          const lineItems: LineItems = [
            new LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", createMoney(27999), 2),
          ];
          const order = new Order({
            id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
            discount: createMoney(0),
            paymentMethod: "pix",
          });

          expect(await orderRepository.store(order)).toEqual(
            "Order was created successfully!"
          );
        });
      });
    });
    describe("when try store order", () => {
      describe("but some operation fail", () => {
        it("database back to initial state by transaction", async () => {
          const lineItems: LineItems = [
            new LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", createMoney(27999), 2),
          ];
          const order = new Order({
            id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            lineItems,
            discount: createMoney(0),
            paymentMethod: "pix",
          });
          const error = new Error("Service Unavailable");
          mockModel(OrderModel).reject(error);
          try {
            await orderRepository.store(order);
          } catch {}

          jest.restoreAllMocks();

          expect((await orderRepository.getAllOrders()).length).toBe(2);
        });
      });
    });
  });
});
