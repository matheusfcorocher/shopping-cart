import { FastifyPluginCallback } from "fastify";
import { getProductsListHandler } from "../controllers/handlers/product";
import { listProductsSchema } from "../controllers/schemas/product";

const listProductsOpts = {
  schema: listProductsSchema,
  handler: getProductsListHandler,
};

const productsRoutes: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  fastify.get("/api/products", listProductsOpts);
  done();
};

export { productsRoutes };
