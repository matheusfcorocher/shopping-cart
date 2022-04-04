import { Type } from '@sinclair/typebox'

const voucherObj = Type.Object({
    id: Type.String(),
    code: Type.String(),
    type: Type.String(),
    amount: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    minValue: Type.Optional(Type.Union([Type.Number(), Type.Null()]))
});

const voucherArray = Type.Array(voucherObj);

const listVouchersSchema = {
    response: {
      200: voucherArray
    },
};

export {listVouchersSchema};