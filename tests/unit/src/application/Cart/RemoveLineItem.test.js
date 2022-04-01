"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RemoveLineItem_1 = __importDefault(require("../../../../../src/application/Cart/RemoveLineItem"));
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
const FakeProductRepository_1 = require("../../../../support/repositories/FakeProductRepository");
describe("Application :: Cart :: RemoveLineItem", () => {
    describe("#execute", () => {
        describe("When cart doesn't have any line item", () => {
            describe("and cart doesnt have voucher", () => {
                it("returns not found error", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems,
                    });
                    const carts = [cart];
                    const removeItem = new Cart_1.LineItem("aaa", 20, 1);
                    const products = [
                        new entities_1.Product({ id: "aaa", name: "foo", price: 20, available: 20 }),
                    ];
                    const removeItems = [removeItem];
                    const newCart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems: removeItems,
                    });
                    const error = new Error("Item with productId aaa wasn't found in cart!");
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                    await expect(() => removeLineItem.execute("aaa", "aaa")).rejects.toThrow(error);
                });
            });
            describe("and cart has voucher", () => {
                it("returns not found error", async () => {
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
                    const error = new Error("Item with productId aaa wasn't found in cart!");
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                    await expect(() => removeLineItem.execute("aaa", "aaa")).rejects.toThrow(error);
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
                    const removeItems = [
                        new Cart_1.LineItem("aaa", 20, 1),
                        new Cart_1.LineItem("bbb", 40, 1),
                    ];
                    const newCart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems: removeItems,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                    const result = await removeLineItem.execute("aaa", "aaa");
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
                    const removeItems = [
                        new Cart_1.LineItem("aaa", 20, 1),
                        new Cart_1.LineItem("bbb", 40, 1),
                    ];
                    const newCart = new entities_1.Cart({
                        id: "aaa",
                        buyerId: "aaa",
                        lineItems: removeItems,
                        appliedVoucher,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                    const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                    const result = await removeLineItem.execute("aaa", "aaa");
                    expect(result).toEqual(newCart);
                });
            });
        });
        describe("When buyerId wasn't found", () => {
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
                    new entities_1.Product({ id: "bbb", name: "pie", price: 20, available: 20 }),
                ];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                const error = new Error("Item with productId aaa wasn't found in cart!");
                await expect(() => removeLineItem.execute("bbb", "aaa")).rejects.toThrow(error);
            });
        });
        describe("When productId wasn't found", () => {
            it("returns not found error", async () => {
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
                    new entities_1.Product({ id: "bbb", name: "foo", price: 20, available: 20 }),
                ];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Product with id aaa can't be found.`;
                await expect(() => removeLineItem.execute("aaa", "aaa")).rejects.toThrow(notFoundError);
            });
        });
        describe("When update the cart gives error", () => {
            it("returns error", async () => {
                const lineItems = [
                    new Cart_1.LineItem("aaa", 20, 2),
                    new Cart_1.LineItem("bbb", 40, 1),
                ];
                const removeItem = new Cart_1.LineItem("aaa", 20, 4);
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
                const removeLineItem = new RemoveLineItem_1.default(cartRepository, productRepository);
                await expect(() => removeLineItem.execute("aaa", "aaa")).rejects.toThrow(error);
            });
        });
    });
});
