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
  appliedVoucher: Type.Union([Type.Optional(appliedVoucherObj), Type.Null()]),
});

const httpResponseError = Type.Object({
  type: Type.Optional(Type.String()),
  title: Type.String(),
  status: Type.String(),
  detail: Type.String(),
  instance: Type.Optional(Type.String()),
})

//schemas

const addLineItemSchema = {
  body: addLineItemObj,
  response: {
    200: cartObj
  },
};

const applyVoucherSchema = {
  body: applyVoucherObj,
  response: {
    200: cartObj
  },
};

const getCurrentCartSchema = {
  params: {
    buyerId: Type.String()
  },
  response: {
    200: cartObj
  },
};

const removeLineItemSchema = {
  body: addLineItemObj,
  response: {
    200: cartObj
  },
};

const removeVoucherSchema = {
  params: {
    buyerId: Type.String()
  },
  response: {
    200: cartObj
  },
};

export { addLineItemSchema, applyVoucherSchema, getCurrentCartSchema, removeLineItemSchema, removeVoucherSchema};
