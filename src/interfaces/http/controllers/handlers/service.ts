import { FastifyRequest, FastifyReply } from "fastify";
import { CheckoutDomainServiceProps } from "../../../../domain/services/CheckoutDomainService";
import { EHConverter, HttpResponseError } from "../../../../lib/CustomError";

const checkoutHandler = async (
  req: FastifyRequest<{
    Body: CheckoutDomainServiceProps;
  }>,
  reply: FastifyReply
) => {
  try {
    const { checkoutDomainService } = req.container.services;    
    const result = await checkoutDomainService.execute(req.body);
    reply.send(result);
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

export { checkoutHandler };
