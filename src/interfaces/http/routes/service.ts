import { FastifyPluginCallback } from "fastify";
import { checkoutHandler } from "../controllers/handlers/service";
import { checkoutSchema } from "../controllers/schemas/service";

const checkoutOpts = {
  schema: checkoutSchema,
  handler: checkoutHandler,
};

const servicesRoutes: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  fastify.post("/api/services/checkout", checkoutOpts);
  done(); 
};

export { servicesRoutes };
