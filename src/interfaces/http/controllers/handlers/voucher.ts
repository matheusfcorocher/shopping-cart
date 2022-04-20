import { FastifyRequest, FastifyReply } from "fastify";
import { EHConverter } from "../../../../lib/CustomError";
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
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

export { getVouchersListHandler };
