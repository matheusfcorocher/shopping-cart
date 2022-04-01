import { FastifyPluginCallback } from "fastify";
import {
  addLineItemHandler,
  applyVoucherHandler,
  removeLineItemHandler,
  removeVoucherHandler,
} from "../controllers/handlers/cart";
import {
  addLineItemSchema,
  applyVoucherSchema,
  removeLineItemSchema,
  removeVoucherSchema,
} from "../controllers/schemas/cart";

const addLineItemOpts = {
  handler: addLineItemHandler,
  schema: addLineItemSchema,
};

const applyVoucherOpts = {
  handler: applyVoucherHandler,
  schema: applyVoucherSchema,
};

const getCurrentCartOpts = {
  handler: applyVoucherHandler,
  schema: applyVoucherSchema,
};

const removeLineItemOpts = {
  handler: removeLineItemHandler,
  schema: removeLineItemSchema,
};

const removeVoucherOpts = {
  handler: removeVoucherHandler,
  schema: removeVoucherSchema,
};

const cartsRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.post("/api/carts/addLineItem", addLineItemOpts);
  fastify.post("/api/carts/applyVoucher", applyVoucherOpts);
  fastify.get("/api/carts/:buyerId", getCurrentCartOpts);
  fastify.put("/api/carts/removeLineItem", removeLineItemOpts);
  fastify.put("/api/carts/removeVoucher/:buyerId", removeVoucherOpts);
  done();
};

export { cartsRoutes };
