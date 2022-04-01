"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const Cart_1 = require("../../../../../../src/domain/entities/Cart");
const AppliedVoucherFactory_1 = require("../../../../../../src/domain/factories/AppliedVoucherFactory");
const CartModel_1 = require("../../../../../../src/infra/database/knex/models/CartModel");
const ObjectionCartMapper_1 = require("../../../../../../src/infra/repositories/cart/ObjectionCartMapper");
describe("Infra :: Cart :: ObjectionCartMapper", () => {
    describe(".toEntity", () => {
        it("returns cart instance with passed props", () => {
            const cartModel = new CartModel_1.CartModel();
            const cartObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                voucherId: "2a20283a-2371-441f-af6e-899fe63def5c",
                type: "fixed",
                amount: 50,
            };
            cartModel.$setJson(cartObject);
            const { uuid, buyerId, voucherId, type, amount, minValue } = cartModel;
            let appliedVoucher = undefined;
            if (voucherId && type && amount) {
                const voucherType = type;
                const voucher = new entities_1.Voucher({
                    id: voucherId,
                    code: "null",
                    type: voucherType,
                    amount,
                    minValue,
                });
                appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
            }
            const lineItems = [new Cart_1.LineItem("2a20283a-2371-441f-af6e-899fe63def5c", 19.99, 5),];
            const expected = new entities_1.Cart({ id: uuid, buyerId, appliedVoucher, lineItems });
            expect(ObjectionCartMapper_1.ObjectionCartMapper.toEntity(cartModel, { appliedVoucher, lineItems })).toEqual(expected);
        });
    });
    describe(".toDatabase", () => {
        it("returns prepared object to be persisted", () => {
            const lineItems = [new Cart_1.LineItem("2a20283a-2371-441f-af6e-899fe63def5c", 19.99, 5),];
            const cartObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                voucherId: "2a20283a-2371-441f-af6e-899fe63def5c",
                type: "fixed",
                amount: 50,
            };
            const voucherType = cartObject.type;
            const voucher = new entities_1.Voucher({
                id: cartObject.uuid,
                code: "null",
                type: voucherType,
                amount: cartObject.amount,
            });
            const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
            const cart = new entities_1.Cart({
                id: "2a20283a-2371-441f-af6e-899fe63def5c",
                buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                lineItems,
                appliedVoucher
            });
            const expected = {
                uuid: cart.id,
                buyerId: cart.buyerId,
                voucherId: voucher.id,
                type: voucher.type,
                amount: voucher.amount,
            };
            expect(ObjectionCartMapper_1.ObjectionCartMapper.toDatabase(cart)).toEqual(expected);
        });
    });
});
