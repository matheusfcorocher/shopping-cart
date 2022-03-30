import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductSerializer } from '../serializers/ProductSerializer';

const getProductsListHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { listProducts } = req.container.products;
    const result = await listProducts.execute();
    reply.send(result.map(r => ProductSerializer.serialize(r)));
  } catch (error : any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
  }
};

export { getProductsListHandler };