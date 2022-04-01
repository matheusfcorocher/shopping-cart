"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../src/domain/factories/AppliedVoucherFactory");
const FakeBuyerRepository_1 = require("../../../../support/repositories/FakeBuyerRepository");
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
const FakeProductRepository_1 = require("../../../../support/repositories/FakeProductRepository");
const FakeVoucherRepository_1 = require("../../../../support/repositories/FakeVoucherRepository");
describe("Domain :: Entity :: Cart", () => {
    describe("#addLineItem", () => {
        describe("When cart has lineItem with quantity different from 0", () => {
            it("returns the quantity plus 1 ", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 2)];
                const lineItemsAnswer = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems: lineItemsAnswer,
                });
                const lineItemData = {
                    productId: lineItemId,
                    price: 20
                };
                cart.addLineItem(lineItemData);
                expect(cart).toEqual(answer);
            });
        });
        describe("When cart doesnt have lineItem", () => {
            it("returns the cart with lineItem ", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [];
                const lineItemsAnswer = [new Cart_1.LineItem(lineItemId, 20, 1)];
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems: lineItemsAnswer,
                });
                const lineItemData = {
                    productId: lineItemId,
                    price: 20
                };
                cart.addLineItem(lineItemData);
                expect(cart).toEqual(answer);
            });
        });
    });
    describe("#applyVoucher", () => {
        describe("When cart doesnt have any voucher", () => {
            it("returns the same cart with voucher", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const vouchers = [];
                const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const voucher = new entities_1.Voucher({
                    id: voucherFactory.getNextId(),
                    code: "XESBQ",
                    type: "fixed",
                    amount: 50,
                });
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                    appliedVoucher
                });
                cart.applyVoucher(appliedVoucher);
                expect(cart).toEqual(answer);
            });
        });
        describe("When cart has voucher", () => {
            it("returns cart with voucher that was applied", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const vouchers = [];
                const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const voucher = new entities_1.Voucher({
                    id: voucherFactory.getNextId(),
                    code: "XESBQ",
                    type: "fixed",
                    amount: 50,
                });
                const voucher2 = new entities_1.Voucher({
                    id: voucherFactory.getNextId(),
                    code: "XESSQ",
                    type: "percentual",
                    amount: 50,
                });
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                const appliedVoucher2 = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher2);
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                    appliedVoucher
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                    appliedVoucher: appliedVoucher2
                });
                cart.applyVoucher(appliedVoucher2);
                expect(cart).toEqual(answer);
            });
        });
    });
    describe("#removeLineItem", () => {
        describe("When productId is not found in cart", () => {
            it("returns not found error", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const error = new Error("Item with productId 3dsa wasn't found in cart!");
                expect(() => cart.removeLineItem('3dsa')).toThrow(error);
            });
        });
        describe("When cart has lineItem with quantity different from 0", () => {
            it("returns the quantity minus 1 ", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const lineItemsAnswer = [new Cart_1.LineItem(lineItemId, 20, 2)];
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems: lineItemsAnswer,
                });
                cart.removeLineItem(lineItemId);
                expect(cart).toEqual(answer);
            });
        });
        describe("When cart has lineItem with quantity 1", () => {
            it("returns the cart without lineItem ", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 1)];
                const lineItemsAnswer = [];
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems: lineItemsAnswer,
                });
                cart.removeLineItem(lineItemId);
                expect(cart).toEqual(answer);
            });
        });
    });
    describe("#removeVoucher", () => {
        describe("When cart doesnt have any voucher", () => {
            it("returns the same cart", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                cart.removeVoucher();
                expect(cart).toEqual(answer);
            });
        });
        describe("When cart has voucher", () => {
            it("returns cart without voucher", () => {
                const carts = [];
                const cartFactory = new FakeCartRepository_1.FakeCartRepository(carts);
                const buyers = [];
                const buyerFactory = new FakeBuyerRepository_1.FakeBuyerRepository(buyers);
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const vouchers = [];
                const voucherFactory = new FakeVoucherRepository_1.FakeVoucherRepository(vouchers);
                const voucher = new entities_1.Voucher({
                    id: voucherFactory.getNextId(),
                    code: "XESBQ",
                    type: "fixed",
                    amount: 50,
                });
                const id = cartFactory.getNextId();
                const buyerId = cartFactory.getNextId();
                const lineItemId = cartFactory.getNextId();
                const lineItems = [new Cart_1.LineItem(lineItemId, 20, 3)];
                const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
                const cart = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                    appliedVoucher
                });
                const answer = new entities_1.Cart({
                    id,
                    buyerId,
                    lineItems,
                });
                cart.removeVoucher();
                expect(cart).toEqual(answer);
            });
        });
    });
});
