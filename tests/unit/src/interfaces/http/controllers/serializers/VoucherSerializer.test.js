"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../../src/domain/entities");
const VoucherSerializer_1 = require("../../../../../../../src/interfaces/http/controllers/serializers/VoucherSerializer");
describe("Interfaces :: HTTP :: Voucher :: VoucherSerializer", () => {
    it("returns id, code, type and amount", () => {
        const voucher = new entities_1.Voucher({
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            code: "AMAZING",
            type: "percentual",
            amount: 40,
        });
        const expected = {
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            code: "AMAZING",
            type: "percentual",
            amount: 40,
        };
        expect(VoucherSerializer_1.VoucherSerializer.serialize(voucher)).toEqual(expected);
    });
    it("returns id, code, type and minValue", () => {
        const voucher = new entities_1.Voucher({
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            code: "AMAZING",
            type: "free shipping",
            minValue: 50,
        });
        const expected = {
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            code: "AMAZING",
            type: "free shipping",
            minValue: 50,
        };
        expect(VoucherSerializer_1.VoucherSerializer.serialize(voucher)).toEqual(expected);
    });
});
