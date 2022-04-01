"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cart_1 = require("../../../../../../../src/domain/entities/Cart");
const entities_1 = require("../../../../../../../src/domain/entities");
const AppliedVoucherFactory_1 = require("../../../../../../../src/domain/factories/AppliedVoucherFactory");
const CartSerializer_1 = require("../../../../../../../src/interfaces/http/controllers/serializers/CartSerializer");
describe("Interfaces :: HTTP :: Cart :: CartSerializer", () => {
    it("returns id, buyerId, lineItems and appliedVoucher", () => {
        const lineItems = [
            new Cart_1.LineItem("2a20283a-2371-441f-af6e-899fe63def5c", 19.99, 5),
        ];
        const voucherType = "fixed";
        const voucher = new entities_1.Voucher({
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            code: "null",
            type: voucherType,
            amount: 50,
        });
        const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
        const cart = new entities_1.Cart({
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
            lineItems,
            appliedVoucher,
        });
        const expected = {
            id: cart.id,
            buyerId: cart.buyerId,
            lineItems: [
                {
                    productId: "2a20283a-2371-441f-af6e-899fe63def5c",
                    unitPrice: 19.99,
                    quantity: 5,
                },
            ],
            appliedVoucher: {
                voucherId: "2a20283a-2371-441f-af6e-899fe63def5c",
                type: voucherType,
                amount: 50,
                minValue: undefined,
            },
        };
        expect(CartSerializer_1.CartSerializer.serialize(cart)).toEqual(expected);
    });
});
