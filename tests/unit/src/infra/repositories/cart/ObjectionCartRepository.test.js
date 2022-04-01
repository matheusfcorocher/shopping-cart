"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const Cart_1 = require("../../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../../src/domain/factories/AppliedVoucherFactory");
const CartModel_1 = require("../../../../../../src/infra/database/knex/models/CartModel");
const LineItemModel_1 = require("../../../../../../src/infra/database/knex/models/LineItemModel");
const ObjectionCartRepository_1 = __importDefault(require("../../../../../../src/infra/repositories/cart/ObjectionCartRepository"));
const ObjectionLineItemMapper_1 = require("../../../../../../src/infra/repositories/lineItem/ObjectionLineItemMapper");
const ObjectionCartMapper_1 = require("../../../../../../src/infra/repositories/cart/ObjectionCartMapper");
const BuyerModelFactory_1 = __importDefault(require("../../../../../support/factories/models/BuyerModelFactory"));
const CartModelFactory_1 = __importDefault(require("../../../../../support/factories/models/CartModelFactory"));
const LineItemModelFactory_1 = __importDefault(require("../../../../../support/factories/models/LineItemModelFactory"));
const ProductModelFactory_1 = __importDefault(require("../../../../../support/factories/models/ProductModelFactory"));
const VoucherModelFactory_1 = __importDefault(require("../../../../../support/factories/models/VoucherModelFactory"));
const objection_1 = __importDefault(require("../../../../../support/objection"));
const { setupIntegrationTest } = require("../../../../../support/setup");
const cartRepository = new ObjectionCartRepository_1.default();
// jest.mock("../../../../../../src/infra/database/knex/models/CartModel");
describe("Infra :: Cart :: ObjectionCartRepository", () => {
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
            {
                uuid: "8bc94226-3e20-40cb-a507-554fabf36fff",
                productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                unitPrice: 69.99,
                quantity: 2,
                ownerId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                ownerType: "cart",
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
        await VoucherModelFactory_1.default.createList([
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
        await CartModelFactory_1.default.createList([
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
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                    });
                    await cartRepository.delete(cart);
                    expect((await CartModel_1.CartModel.query()).length).toBe(1);
                });
            });
            describe("return success message", () => {
                it("returns correct result", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                    });
                    expect(await cartRepository.delete(cart)).toEqual("Cart was deleted successfully.");
                });
            });
        });
        describe("when cart has lineItems", () => {
            describe("deletes lineItems from database", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    await cartRepository.delete(cart);
                    expect((await LineItemModel_1.LineItemModel.query()).length).toBe(3);
                });
            });
            describe("deletes cart from database", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    await cartRepository.delete(cart);
                    expect((await CartModel_1.CartModel.query()).length).toBe(1);
                });
            });
            describe("return success message", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    expect(await cartRepository.delete(cart)).toEqual("Cart was deleted successfully.");
                });
            });
        });
        describe("when try to delete cart", () => {
            describe("but cart isn't found", () => {
                it("returns not found error", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                    });
                    const notFoundError = new Error("Not Found Error");
                    notFoundError.message = `Cart with id ${cart.id} can't be found.`;
                    await expect(() => cartRepository.delete(cart)).rejects.toThrow(notFoundError);
                });
            });
            describe("but lineItem isn't found", () => {
                it("returns not found error", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    const notFoundError = new Error("Not Found Error");
                    notFoundError.message = `LineItems can't be found.`;
                    await expect(() => cartRepository.delete(cart)).rejects.toThrow(notFoundError);
                });
            });
            describe("but some operation fail", () => {
                it("database back to initial state by transaction", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "fixed",
                        amount: 50,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    const error = new Error("Service Unavailable");
                    (0, objection_1.default)(CartModel_1.CartModel).reject(error);
                    try {
                        await cartRepository.delete(cart);
                    }
                    catch { }
                    jest.restoreAllMocks();
                    expect(await cartRepository.getCartById("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf")).toEqual(cart);
                });
            });
        });
    });
    describe("#getAllCarts", () => {
        describe("When method is called", () => {
            describe("result is a array instance of cart", () => {
                it("returns correct result", async () => {
                    const carts = await cartRepository.getAllCarts();
                    expect(carts[0]).toBeInstanceOf(entities_1.Cart);
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
                    const lineItems = [];
                    const lineItems2 = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "fixed",
                        amount: 50,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const expected = [
                        new entities_1.Cart({
                            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                            lineItems,
                        }),
                        new entities_1.Cart({
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
                    const lineItems = [];
                    const cart = new entities_1.Cart({
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
                    await expect(() => cartRepository.getCartById(cardId)).rejects.toThrow(notFoundError);
                });
            });
        });
    });
    describe("#getCartByBuyerId", () => {
        describe("when execute method", () => {
            describe("and cart is found", () => {
                it("returns correct result", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                    });
                    expect(await cartRepository.getCartByBuyerId(cart.buyerId)).toEqual(cart);
                });
            });
        });
        describe("when try to get cart by id", () => {
            describe("but cart isn't found", () => {
                it("returns not found error", async () => {
                    const buyerId = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcs";
                    const notFoundError = new Error("Not Found Error");
                    notFoundError.message = `Cart with buyerId ${buyerId} can't be found.`;
                    cartRepository.delete = () => Promise.reject(notFoundError);
                    await expect(() => cartRepository.getCartByBuyerId(buyerId)).rejects.toThrow(notFoundError);
                });
            });
        });
    });
    describe("#update", () => {
        describe("when cart doesnt have any lineItems", () => {
            describe("return success message", () => {
                it("returns correct result", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
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
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 0),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    await cartRepository.update(cart);
                    expect((await LineItemModel_1.LineItemModel.query().where({
                        ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        ownerType: "cart",
                        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    })).length).toBe(0);
                });
            });
            describe("update lineItem from database when quantity > 0", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 4),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    await cartRepository.update(cart);
                    expect(await LineItemModel_1.LineItemModel.query()
                        .findOne({
                        ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        ownerType: "cart",
                        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    })
                        .then((data) => ObjectionLineItemMapper_1.ObjectionLineItemMapper.toEntity(data))).toEqual(lineItems[0]);
                });
            });
            describe("store lineItem in database", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                        appliedVoucher,
                    });
                    await cartRepository.update(cart);
                    expect(await LineItemModel_1.LineItemModel.query()
                        .findOne({
                        ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        ownerType: "cart",
                        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    })
                        .then((data) => ObjectionLineItemMapper_1.ObjectionLineItemMapper.toEntity(data))).toEqual(lineItems[0]);
                });
            });
            describe("update cart from database", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    await cartRepository.update(cart);
                    expect(await CartModel_1.CartModel.query()
                        .findOne({
                        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    })
                        .then((d) => ObjectionCartMapper_1.ObjectionCartMapper.toEntity(d, { lineItems, appliedVoucher }))).toEqual(cart);
                });
            });
            describe("return success message", () => {
                it("returns correct result", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        code: "TEST1",
                        type: "percentual",
                        amount: 40,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        lineItems,
                        appliedVoucher,
                    });
                    expect(await cartRepository.update(cart)).toEqual(cart);
                });
            });
        });
        describe("when try update cart", () => {
            describe("but some operation fail", () => {
                it("database back to initial state by transaction", async () => {
                    const lineItems = [
                        new Cart_1.LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd", 69.99, 2),
                    ];
                    const cart = new entities_1.Cart({
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems,
                    });
                    const error = new Error("Service Unavailable");
                    (0, objection_1.default)(CartModel_1.CartModel).reject(error);
                    try {
                        await cartRepository.update(cart);
                    }
                    catch { }
                    jest.restoreAllMocks();
                    expect(await cartRepository.getCartById("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd")).not.toEqual(cart);
                });
            });
        });
    });
});
