import { FastifyRequest, FastifyReply } from "fastify";
import { EHConverter } from "../../../../lib/CustomError";
import { ProductSerializer } from "../serializers/ProductSerializer";

const getProductsListHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { listProducts } = req.container.products;
    const result = await listProducts();
    reply.send(result.map((r) => ProductSerializer.serialize(r)));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

export { getProductsListHandler };
