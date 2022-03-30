import { Type } from '@sinclair/typebox'

const voucherObj = Type.Object({
    id: Type.String(),
    code: Type.String(),
    type: Type.String(),
    amount: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    minValue: Type.Optional(Type.Union([Type.Number(), Type.Null()]))
});

const listVouchersSchema = {
    response: {
      200: {
        type: "array",
        items: voucherObj,
      },
    },
};

export {listVouchersSchema};