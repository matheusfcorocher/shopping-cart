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
  appliedVoucher: Type.Optional(appliedVoucherObj),
});

//schemas

const addLineItemSchema = {
  body: {
    type: "object",
    required: ["buyerId", "productId"],
    properties: addLineItemObj,
  },
  response: {
    200: {
      type: "object",
      items: cartObj,
    },
  },
};

const applyVoucherSchema = {
  body: {
    type: "object",
    required: ["buyerId", "code"],
    properties: applyVoucherObj,
  },
  response: {
    200: {
      type: "object",
      items: cartObj,
    },
  },
};

const getCurrentCartSchema = {
  params: {
    buyerId: Type.String()
  },
  response: {
    200: {
      type: "object",
      items: cartObj,
    },
  },
};

const removeLineItemSchema = {
  body: {
    type: "object",
    required: ["buyerId", "productId"],
    properties: addLineItemObj,
  },
  response: {
    200: {
      type: "object",
      items: cartObj,
    },
  },
};

const removeVoucherSchema = {
  params: {
    buyerId: Type.String()
  },
  response: {
    200: {
      type: "object",
      items: cartObj,
    },
  },
};

export { addLineItemSchema, applyVoucherSchema, getCurrentCartSchema, removeLineItemSchema, removeVoucherSchema};
