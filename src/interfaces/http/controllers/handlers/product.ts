import { FastifyRequest, FastifyReply } from "fastify";
import { HttpResponseError } from "../../../../lib/CustomError";
import { ProductSerializer } from "../serializers/ProductSerializer";

const getProductsListHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { listProducts } = req.container.products;
    const result = await listProducts.execute();
    reply.send(result.map((r) => ProductSerializer.serialize(r)));
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

export { getProductsListHandler };
