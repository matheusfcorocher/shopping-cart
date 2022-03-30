import { FastifyRequest, FastifyReply } from 'fastify';
import { CheckoutDomainServiceProps } from '../../../../domain/services/CheckoutDomainService';

const checkoutHandler = async (req: FastifyRequest<{
  Body: CheckoutDomainServiceProps
}>, reply: FastifyReply) => {
  try {
    const { checkoutDomainService } = req.container.services;
    const result = await checkoutDomainService.execute(req.body);
    reply.send(result);
  } catch (error : any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
  }
};

export { checkoutHandler };