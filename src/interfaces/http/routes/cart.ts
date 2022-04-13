import { FastifyPluginCallback } from "fastify";
import {
  addLineItemHandler,
  applyVoucherHandler,
  getCurrentCartHandler,
  removeLineItemHandler,
  removeVoucherHandler,
} from "../controllers/handlers/cart";
import {
  addLineItemSchema,
  applyVoucherSchema,
  getCurrentCartSchema,
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
  handler: getCurrentCartHandler,
  schema: getCurrentCartSchema,
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
  fastify.post("/api/carts/items", addLineItemOpts);
  fastify.post("/api/carts/voucher", applyVoucherOpts);
  fastify.get("/api/carts/:buyerId", getCurrentCartOpts);
  fastify.delete("/api/carts/items", removeLineItemOpts);
  fastify.delete("/api/carts/voucher/:buyerId", removeVoucherOpts);
  done();
};

export { cartsRoutes };
