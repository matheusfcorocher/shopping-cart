import { FastifyPluginCallback } from "fastify";
import { getVouchersListHandler } from "../controllers/handlers/voucher";
import { listVouchersSchema } from "../controllers/schemas/voucher";

const listVouchersOpts = {
  schema: listVouchersSchema,
  handler: getVouchersListHandler,
};

const vouchersRoutes: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  fastify.get("/api/vouchers", listVouchersOpts);
  done();
};

export { vouchersRoutes };
