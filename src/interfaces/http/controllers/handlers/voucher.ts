import { FastifyRequest, FastifyReply } from "fastify";
import { HttpResponseError } from "../../../../lib/CustomError";
import { VoucherSerializer } from "../serializers/VoucherSerializer";

const getVouchersListHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { listVouchers } = req.container.vouchers;
    const result = await listVouchers.execute();
    console.log(result.map((r) => VoucherSerializer.serialize(r)));
    reply.send(result.map((r) => VoucherSerializer.serialize(r)));
  } catch (error: any) {
    const httpResponseError = new HttpResponseError({
      title: error.title,
      status: error.status,
      message: error.message,
      detail: error.detail,
    });
    switch (error.status) {
      case 404:
        return reply.status(404).send(httpResponseError.toJson());
      default:
        httpResponseError.title = "Internal Server Error";
        httpResponseError.status = 500;
        return reply.status(500).send(httpResponseError.toJson());
    }
  }
};

export { getVouchersListHandler };
