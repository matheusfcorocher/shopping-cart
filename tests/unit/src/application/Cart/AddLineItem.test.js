"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddLineItem_1 = __importDefault(require("../../../../../src/application/Cart/AddLineItem"));
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
const FakeProductRepository_1 = require("../../../../support/repositories/FakeProductRepository");
describe("Application :: Cart :: AddLineItem", () => {
    describe("#execute", () => {
        describe("When cart doesn't have any line item", () => {
            describe("and cart doesnt have voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: "aad",
                        buyerId: "aad",
                        lineItems,
                    });
                    const carts = [cart];
                    const products = [
                        new entities_1.Product({ id: "aad", name: "foo", price: 20, available: 20 }),
                    ];
                    const newLineItem = new Cart_1.LineItem("aad", 20, 1);
                    const newLineItems = [newLineItem];
                    const newCart = new entities_1.Cart({
                        id: "aad",
                        buyerId: "aad",
                        lineItems: newLineItems,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const addLineItem = new AddLineItem_1.default(cartRepository, productRepository);
                    const result = await addLineItem.execute("aad", "aad");
                    expect(result).toEqual(newCart);
                });
            });
            describe("and cart has voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [];
                    const voucher = new entities_1.Voucher({
                        id: "aaa",
                        code: "#F121221",
                        type: "percentual",
                        amount: 30.0,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher,
                    });
                    const carts = [cart];
                    const products = [
                        new entities_1.Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
                    ];
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const addLineItem = new AddLineItem_1.default(cartRepository, productRepository);
                    const newLineItem = new Cart_1.LineItem("aaa", 20, 1);
                    const newLineItems = [newLineItem];
                    const newCart = new entities_1.Cart({
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
                    const lineItems = [
                        new Cart_1.LineItem("aaa", 20, 2),
                        new Cart_1.LineItem("bbb", 40, 1),
                    ];
                    const cart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems,
                    });
                    const carts = [cart];
                    const products = [
                        new entities_1.Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
                    ];
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const addLineItem = new AddLineItem_1.default(cartRepository, productRepository);
                    const newLineItems = [
                        new Cart_1.LineItem("aaa", 20, 3),
                        new Cart_1.LineItem("bbb", 40, 1),
                    ];
                    const newCart = new entities_1.Cart({
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
                    const lineItems = [
                        new Cart_1.LineItem("aaa", 20, 2),
                        new Cart_1.LineItem("bbb", 40, 1),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: "aaa",
                        code: "#F121221",
                        type: "percentual",
                        amount: 30.0,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher,
                    });
                    const carts = [cart];
                    const products = [
                        new entities_1.Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
                    ];
                    const newLineItems = [
                        new Cart_1.LineItem("aaa", 20, 3),
                        new Cart_1.LineItem("bbb", 40, 1),
                    ];
                    const newCart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems: newLineItems,
                        appliedVoucher,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const addLineItem = new AddLineItem_1.default(cartRepository, productRepository);
                    const result = await addLineItem.execute("aaa", "aaa");
                    expect(result).toEqual(newCart);
                });
            });
        });
        describe("When buyerId wasn't found", () => {
            it("returns correct cart", async () => {
                const carts = [];
                const products = [
                    new entities_1.Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
                ];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const addLineItem = new AddLineItem_1.default(cartRepository, productRepository);
                expect(await addLineItem.execute("bbb", "aaa")).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    buyerId: expect.any(String),
                    lineItems: [new Cart_1.LineItem("aaa", 20, 1)],
                }));
            });
        });
        describe("When update the cart gives error", () => {
            it("returns error", async () => {
                const lineItems = [
                    new Cart_1.LineItem("aaa", 20, 2),
                    new Cart_1.LineItem("bbb", 40, 1),
                ];
                const newLineItem = new Cart_1.LineItem("aaa", 20, 4);
                const voucher = new entities_1.Voucher({
                    id: "aaa",
                    code: "#F121221",
                    type: "percentual",
                    amount: 30.0,
                });
                const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                const cart = new entities_1.Cart({
                    id: "aaa",
                    buyerId: "aaa",
                    lineItems,
                    appliedVoucher,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
                ];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const error = new Error("Service Unavailable");
                cartRepository.update = () => {
                    throw error;
                };
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const addLineItem = new AddLineItem_1.default(cartRepository, productRepository);
                await expect(() => addLineItem.execute("aaa", "aaa")).rejects.toThrow(error);
            });
        });
    });
});
