import { Type } from "@sinclair/typebox";

//schemas body

const addLineItemObj = Type.Object({
  buyerId: Type.String(),
  productId: Type.String(),
});

const applyVoucherObj = Type.Object({
  buyerId: Type.String(),
  code: Type.String(),
});

//cart response obj
const lineItemObj = Type.Object({
  productId: Type.String(),
  unitPrice: Type.Number(),
  quantity: Type.Number(),
});
const lineItemsObj = Type.Array(lineItemObj);

const appliedVoucherObj = Type.Object({
  voucherId: Type.String(),
  type: Type.String(),
  amount: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  minValue: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});

const cartObj = Type.Object({
  id: Type.String(),
  buyerId: Type.Optional(Type.String()),
  lineItems: lineItemsObj,
  subtotal: Type.Number(),
  shipping: Type.Number(),
  discount: Type.Number(),
  total: Type.Number(),
  appliedVoucher: Type.Union([Type.Optional(appliedVoucherObj), Type.Null()]),
});

const errorObj = Type.Object({
  title: Type.String(),
  code: Type.String(),
  detail: Type.Optional(Type.String()),
  message: Type.String(),
  instance: Type.Optional(Type.String()),
});

const httpResponseError = Type.Object({
  type: Type.Optional(Type.String()),
  hasManyErrors: Type.Optional(Type.Boolean()),
  title: Type.String(),
  status: Type.Number(),
  message: Type.String(),
  detail: Type.Optional(Type.String()),
  instance: Type.Optional(Type.String()),
  errors: Type.Optional(Type.Array(errorObj))
});

//schemas

const addLineItemSchema = {
  description: 'Add one line item in the cart with given productId of product and buyerId of buyer.',
  body: addLineItemObj,
  response: {
    200: cartObj,
  },
};

const applyVoucherSchema = {
  description: 'Add voucher in a cart given the code of voucher and buyerId of cart.',
  body: applyVoucherObj,
  response: {
    200: cartObj,
    400: httpResponseError,
    500: httpResponseError
  },
};

const getCurrentCartSchema = {
  description: 'Get cart by buyerId of buyer.',
  params: {
    buyerId: Type.String(),
  },
  response: {
    200: cartObj,
    400: httpResponseError,
    500: httpResponseError
  },
};

const removeLineItemSchema = {
  description: 'Remove one line item in the cart with given productId of product and buyerId of buyer.',
  body: addLineItemObj,
  response: {
    200: cartObj,
    400: httpResponseError,
    500: httpResponseError
  },
};

const removeVoucherSchema = {
  description: 'Remove voucher in a cart with given buyerId of buyer.',
  params: {
    buyerId: Type.String(),
  },
  response: {
    200: cartObj,
    400: httpResponseError,
    500: httpResponseError
  },
};

export {
  addLineItemSchema,
  applyVoucherSchema,
  getCurrentCartSchema,
  removeLineItemSchema,
  removeVoucherSchema,
  httpResponseError,
};
