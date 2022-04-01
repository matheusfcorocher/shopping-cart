"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetCurrentCart_1 = __importDefault(require("../../../../../src/application/Cart/GetCurrentCart"));
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
describe("Application :: Cart :: GetCurrentCart", () => {
    describe("#execute", () => {
        describe("When cart doesn't have any line item", () => {
            describe("and cart doesnt have voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [];
                    const cart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                    });
                    const carts = [cart];
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const getCurrentCart = new GetCurrentCart_1.default(cartRepository);
                    const result = await getCurrentCart.execute('aaa');
                    expect(result).toEqual(cart);
                });
            });
            describe("and cart has voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [];
                    const voucher = new entities_1.Voucher({
                        id: 'aaa',
                        code: "#F121221",
                        type: "percentual",
                        amount: 30.0,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher,
                    });
                    const carts = [cart];
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const getCurrentCart = new GetCurrentCart_1.default(cartRepository);
                    const result = await getCurrentCart.execute('aaa');
                    expect(result).toEqual(cart);
                });
            });
        });
        describe("When cart has line items", () => {
            describe("and cart doesnt have voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [
                        new Cart_1.LineItem('aaa', 20, 2),
                        new Cart_1.LineItem('bbb', 40, 1),
                    ];
                    const cart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                    });
                    const carts = [cart];
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const getCurrentCart = new GetCurrentCart_1.default(cartRepository);
                    const result = await getCurrentCart.execute('aaa');
                    expect(result).toEqual(cart);
                });
            });
            describe("and cart has voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [
                        new Cart_1.LineItem('aaa', 20, 2),
                        new Cart_1.LineItem('bbb', 40, 1),
                    ];
                    const voucher = new entities_1.Voucher({
                        id: 'aaa',
                        code: "#F121221",
                        type: "percentual",
                        amount: 30.0,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher,
                    });
                    const carts = [cart];
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const getCurrentCart = new GetCurrentCart_1.default(cartRepository);
                    const result = await getCurrentCart.execute('aaa');
                    expect(result).toEqual(cart);
                });
            });
        });
        describe("When buyerId wasn't found", () => {
            it("returns not found error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('aaa', 20, 2),
                    new Cart_1.LineItem('bbb', 40, 1),
                ];
                const voucher = new entities_1.Voucher({
                    id: 'aaa',
                    code: "#F121221",
                    type: "percentual",
                    amount: 30.0,
                });
                const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                const cart = new entities_1.Cart({
                    id: 'aaa',
                    buyerId: "aaa",
                    lineItems,
                    appliedVoucher,
                });
                const carts = [cart];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const getCurrentCart = new GetCurrentCart_1.default(cartRepository);
                expect(await getCurrentCart.execute('bbb')).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    buyerId: expect.any(String),
                    lineItems: []
                }));
            });
        });
    });
});
