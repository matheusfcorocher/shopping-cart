"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVouchersSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const voucherObj = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    code: typebox_1.Type.String(),
    type: typebox_1.Type.String(),
    amount: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()])),
    minValue: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()]))
});
const voucherArray = typebox_1.Type.Array(voucherObj);
const listVouchersSchema = {
    response: {
        200: voucherArray
    },
};
exports.listVouchersSchema = listVouchersSchema;
