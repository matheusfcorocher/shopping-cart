import { FastifyRequest, FastifyReply } from "fastify";
import { EHConverter } from "../../../../lib/errors/ErrorConverter";
import { HttpError } from "../../../../lib/errors/HttpError";
import { VoucherSerializer } from "../serializers/VoucherSerializer";

const getVouchersListHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { listVouchers } = req.container.vouchers;
    const result = await listVouchers();
    reply.send(result.map((r) => VoucherSerializer.serialize(r)));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(HttpError.toJson(httpResponseError));
  }
};

export { getVouchersListHandler };
