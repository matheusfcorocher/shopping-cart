"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplyVoucher_1 = __importDefault(require("../../../../../src/application/Cart/ApplyVoucher"));
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
const FakeVoucherRepository_1 = require("../../../../support/repositories/FakeVoucherRepository");
describe("Application :: Cart :: ApplyVoucher", () => {
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
                    const voucher = new entities_1.Voucher({
                        id: 'aaa',
                        code: "XESBQ",
                        type: "fixed",
                        amount: 50,
                    });
                    const vouchers = [voucher];
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher: appliedVoucher,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                    const result = await applyVoucher.execute('aaa', "XESBQ");
                    expect(result).toEqual(newCart);
                });
            });
            describe("and cart has voucher", () => {
                it("returns correct cart", async () => {
                    const lineItems = [];
                    const voucher = new entities_1.Voucher({
                        id: 'aaa',
                        code: "XESBQ",
                        type: "fixed",
                        amount: 50,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher: appliedVoucher,
                    });
                    const carts = [cart];
                    const voucher2 = new entities_1.Voucher({
                        id: 'aaa',
                        code: "AKITANDO",
                        type: "percentual",
                        amount: 50,
                    });
                    const vouchers = [voucher, voucher2];
                    const appliedVoucher2 = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher2);
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher: appliedVoucher2,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                    const result = await applyVoucher.execute('aaa', "AKITANDO");
                    expect(result).toEqual(newCart);
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
                    const voucher = new entities_1.Voucher({
                        id: 'aaa',
                        code: "AKITANDO",
                        type: "percentual",
                        amount: 50,
                    });
                    const vouchers = [voucher];
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher: appliedVoucher,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                    const result = await applyVoucher.execute('aaa', "AKITANDO");
                    expect(result).toEqual(newCart);
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
                        code: "XESBQ",
                        type: "fixed",
                        amount: 50,
                    });
                    const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                    const cart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher: appliedVoucher,
                    });
                    const carts = [cart];
                    const voucher2 = new entities_1.Voucher({
                        id: 'bbb',
                        code: "AKITANDO",
                        type: "percentual",
                        amount: 50,
                    });
                    const vouchers = [voucher, voucher2];
                    const appliedVoucher2 = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher2);
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                        appliedVoucher: appliedVoucher2,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                    const result = await applyVoucher.execute('aaa', "AKITANDO");
                    expect(result).toEqual(newCart);
                });
            });
        });
        describe("When buyerId wasn't found", () => {
            it("returns correct cart", async () => {
                const lineItems = [];
                const cart = new entities_1.Cart({
                    id: 'aaa',
                    buyerId: "aaa",
                    lineItems,
                });
                const carts = [cart];
                const voucher = new entities_1.Voucher({
                    id: 'aaa',
                    code: "XESBQ",
                    type: "fixed",
                    amount: 50,
                });
                const vouchers = [voucher];
                const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                expect(await applyVoucher.execute('bbb', "XESBQ")).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    buyerId: expect.any(String),
                    lineItems: [],
                    appliedVoucher
                }));
            });
        });
        describe("When voucher code wasn't found", () => {
            it("returns not found error", async () => {
                const lineItems = [];
                const cart = new entities_1.Cart({
                    id: 'aaa',
                    buyerId: "aaa",
                    lineItems,
                });
                const carts = [cart];
                const voucher = new entities_1.Voucher({
                    id: 'aaa',
                    code: "XESBB",
                    type: "fixed",
                    amount: 50,
                });
                const vouchers = [voucher];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Voucher with code XESBQ can't be found.`;
                await expect(() => applyVoucher.execute('aaa', "XESBQ")).rejects.toThrow(notFoundError);
            });
        });
        describe("When update the cart gives error", () => {
            it("returns error", async () => {
                const lineItems = [];
                const cart = new entities_1.Cart({
                    id: 'aaa',
                    buyerId: "aaa",
                    lineItems,
                });
                const carts = [cart];
                const voucher = new entities_1.Voucher({
                    id: 'aaa',
                    code: "XESBQ",
                    type: "fixed",
                    amount: 50,
                });
                const vouchers = [voucher];
                const error = new Error("Service Unavailable");
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                cartRepository.update = () => {
                    throw error;
                };
                const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const applyVoucher = new ApplyVoucher_1.default(cartRepository, voucherRepository);
                await expect(() => applyVoucher.execute('aaa', "XESBQ")).rejects.toThrow(error);
            });
        });
    });
});
