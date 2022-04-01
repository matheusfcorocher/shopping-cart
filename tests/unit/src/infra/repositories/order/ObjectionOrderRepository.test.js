"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const Cart_1 = require("../../../../../../src/domain/entities/Cart");
const LineItemModel_1 = require("../../../../../../src/infra/database/knex/models/LineItemModel");
const ObjectionLineItemMapper_1 = require("../../../../../../src/infra/repositories/lineItem/ObjectionLineItemMapper");
const BuyerModelFactory_1 = __importDefault(require("../../../../../support/factories/models/BuyerModelFactory"));
const LineItemModelFactory_1 = __importDefault(require("../../../../../support/factories/models/LineItemModelFactory"));
const ProductModelFactory_1 = __importDefault(require("../../../../../support/factories/models/ProductModelFactory"));
const objection_1 = __importDefault(require("../../../../../support/objection"));
const OrderModelFactory_1 = __importDefault(require("../../../../../support/factories/models/OrderModelFactory"));
const ObjectionOrderRepository_1 = __importDefault(require("../../../../../../src/infra/repositories/order/ObjectionOrderRepository"));
const OrderModel_1 = require("../../../../../../src/infra/database/knex/models/OrderModel");
const ObjectionOrderMapper_1 = require("../../../../../../src/infra/repositories/order/ObjectionOrderMapper");
const { setupIntegrationTest } = require("../../../../../support/setup");
const orderRepository = new ObjectionOrderRepository_1.default();
// jest.mock("../../../../../../src/infra/database/knex/models/OrderModel");
describe("Infra :: Order :: ObjectionOrderRepository", () => {
    setupIntegrationTest();
    beforeEach(async () => {
        await ProductModelFactory_1.default.createList([
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
        await LineItemModelFactory_1.default.createList([
            {
                uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                unitPrice: 69.99,
                quantity: 2,
                ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                ownerType: "order",
            },
        ]);
        await BuyerModelFactory_1.default.createList([
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
        await OrderModelFactory_1.default.createList([
            {
                uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                discount: 50,
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
                    expect(orders[0]).toBeInstanceOf(entities_1.Order);
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
                    const lineItems = [];
                    const lineItems2 = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const expected = [
                        new entities_1.Order({
                            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                            lineItems,
                            discount: 0,
                            paymentMethod: "pix",
                        }),
                        new entities_1.Order({
                            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                            lineItems: lineItems2,
                            discount: 50,
                            paymentMethod: "debit card",
                        }),
                    ];
                    const orders = await orderRepository.getAllOrders();
                    expect(orders).toEqual(expect.arrayContaining(expected));
                });
            });
        });
        describe("When service is unavailable", () => {
            it("returns error", async () => {
                const error = new Error("Service Unavailable");
                (0, objection_1.default)(OrderModel_1.OrderModel).reject(error);
                await expect(() => orderRepository.getAllOrders()).rejects.toThrow(error);
                jest.restoreAllMocks();
            });
        });
    });
    describe("#store", () => {
        describe("when order doesnt have any lineItems", () => {
            describe("return success message", () => {
                it("returns correct result", async () => {
                    const lineItems = [];
                    const order = new entities_1.Order({
                        id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                        discount: 0,
                        paymentMethod: "pix",
                    });
                    expect(await orderRepository.store(order)).toEqual("Order was created successfully!");
                });
            });
        });
        describe("when order has lineItems", () => {
            describe("store order in database", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", 279.99, 2),
                    ];
                    const order = new entities_1.Order({
                        id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                        discount: 0,
                        paymentMethod: "pix",
                    });
                    await orderRepository.store(order);
                    expect(await OrderModel_1.OrderModel.query()
                        .findOne({
                        uuid: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                    })
                        .then((d) => ObjectionOrderMapper_1.ObjectionOrderMapper.toEntity(d, lineItems))).toEqual(order);
                });
            });
            describe("store lineItem in database", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", 279.99, 2),
                    ];
                    const order = new entities_1.Order({
                        id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                        discount: 0,
                        paymentMethod: "pix",
                    });
                    await orderRepository.store(order);
                    expect(await LineItemModel_1.LineItemModel.query()
                        .findOne({
                        ownerId: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                        ownerType: "order",
                        productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                    })
                        .then((data) => ObjectionLineItemMapper_1.ObjectionLineItemMapper.toEntity(data))).toEqual(lineItems[0]);
                });
            });
            describe("return success message", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", 279.99, 2),
                    ];
                    const order = new entities_1.Order({
                        id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                        discount: 0,
                        paymentMethod: "pix",
                    });
                    expect(await orderRepository.store(order)).toEqual("Order was created successfully!");
                });
            });
        });
        describe("when try store order", () => {
            describe("but some operation fail", () => {
                it("database back to initial state by transaction", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("92d91715-34ad-449e-9b81-73f1a74ef44e", 279.99, 2),
                    ];
                    const order = new entities_1.Order({
                        id: "7442feba-c819-4ab0-b851-dbdbb3ee4c68",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                        discount: 0,
                        paymentMethod: "pix",
                    });
                    const error = new Error("Service Unavailable");
                    (0, objection_1.default)(OrderModel_1.OrderModel).reject(error);
                    try {
                        await orderRepository.store(order);
                    }
                    catch { }
                    jest.restoreAllMocks();
                    expect((await orderRepository.getAllOrders()).length).toBe(2);
                });
            });
        });
    });
});
