import { FastifyRequest, FastifyReply } from 'fastify';
import { VoucherSerializer } from '../serializers/VoucherSerializer';

const getVouchersListHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { listVouchers } = req.container.vouchers;
      const result = await listVouchers.execute();
      console.log(result.map(r => VoucherSerializer.serialize(r)));
      reply.send(result.map(r => VoucherSerializer.serialize(r)));
    } catch (error : any) {
      switch (error.CODE) {
        default:
          const { message, details } = error;
          return reply.status(500).send({ message, details });
      }
    }
  };
  
  export { getVouchersListHandler };