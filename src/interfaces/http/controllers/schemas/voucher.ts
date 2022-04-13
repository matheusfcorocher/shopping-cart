import { Type } from '@sinclair/typebox'
import { httpResponseError } from './cart';

const voucherObj = Type.Object({
    id: Type.String(),
    code: Type.String(),
    type: Type.String(),
    amount: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    minValue: Type.Optional(Type.Union([Type.Number(), Type.Null()]))
});

const voucherArray = Type.Array(voucherObj);

const listVouchersSchema = {
    description: "Get all availables vouchers in database.",
    response: {
      200: voucherArray,
      400: httpResponseError,
      500: httpResponseError
    },
};

export {listVouchersSchema};