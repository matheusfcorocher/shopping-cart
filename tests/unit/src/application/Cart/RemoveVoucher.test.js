"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RemoveVoucher_1 = __importDefault(require("../../../../../src/application/Cart/RemoveVoucher"));
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
const FakeVoucherRepository_1 = require("../../../../support/repositories/FakeVoucherRepository");
describe("Application :: Cart :: RemoveVoucher", () => {
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
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const removeVoucher = new RemoveVoucher_1.default(cartRepository, voucherRepository);
                    const result = await removeVoucher.execute('aaa');
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
                    const vouchers = [voucher];
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const removeVoucher = new RemoveVoucher_1.default(cartRepository, voucherRepository);
                    const result = await removeVoucher.execute('aaa');
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
                        code: "XESBQ",
                        type: "fixed",
                        amount: 50,
                    });
                    const vouchers = [voucher];
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const removeVoucher = new RemoveVoucher_1.default(cartRepository, voucherRepository);
                    const result = await removeVoucher.execute('aaa');
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
                    const vouchers = [voucher];
                    const newCart = new entities_1.Cart({
                        id: 'aaa',
                        buyerId: "aaa",
                        lineItems,
                    });
                    const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                    const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                    const removeVoucher = new RemoveVoucher_1.default(cartRepository, voucherRepository);
                    const result = await removeVoucher.execute('aaa');
                    expect(result).toEqual(newCart);
                });
            });
        });
        describe("When buyerId wasn't found", () => {
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
                    code: "XESBQ",
                    type: "fixed",
                    amount: 50,
                });
                const vouchers = [voucher];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const voucherRepository = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const removeVoucher = new RemoveVoucher_1.default(cartRepository, voucherRepository);
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Cart with id bbb can't be found.`;
                expect(await removeVoucher.execute('bbb')).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    buyerId: expect.any(String),
                    lineItems,
                }));
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
                const removeVoucher = new RemoveVoucher_1.default(cartRepository, voucherRepository);
                await expect(() => removeVoucher.execute('aaa')).rejects.toThrow(error);
            });
        });
    });
});
