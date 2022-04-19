import { FastifyRequest, FastifyReply } from "fastify";
import { DataProps } from "../../../../domain/services/CheckoutDomainService";
import { EHConverter } from "../../../../lib/CustomError";

const checkoutHandler = async (
  req: FastifyRequest<{
    Body: DataProps;
  }>,
  reply: FastifyReply
) => {
  try {
    const { checkout } = req.container.services;    
    const result = await checkout(req.body);
    reply.send(result);
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

export { checkoutHandler };
