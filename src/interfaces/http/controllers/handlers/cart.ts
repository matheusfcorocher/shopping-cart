import { FastifyRequest, FastifyReply } from "fastify";
import { EHConverter } from "../../../../lib/CustomError";
import { CartSerializer } from "../serializers/CartSerializer";

const addLineItemHandler = async (
  req: FastifyRequest<{
    Body: {
      buyerId: string;
      productId: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { addLineItem } = req.container.carts;
    const result = await addLineItem(req.body);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

const applyVoucherHandler = async (
  req: FastifyRequest<{
    Body: {
      buyerId: string;
      code: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { applyVoucher } = req.container.carts;
    const result = await applyVoucher(req.body);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

const getCurrentCartHandler = async (
  req: FastifyRequest<{
    Params: {
      buyerId: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { getCurrentCart } = req.container.carts;
    const { buyerId } = req.params;
    const result = await getCurrentCart(buyerId);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

const removeLineItemHandler = async (
  req: FastifyRequest<{
    Body: {
      buyerId: string;
      productId: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { removeLineItem } = req.container.carts;
    const result = await removeLineItem(req.body);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

const removeVoucherHandler = async (
  req: FastifyRequest<{
    Params: {
      buyerId: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { removeVoucher } = req.container.carts;
    const { buyerId } = req.params;
    const result = await removeVoucher(buyerId);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    const httpResponseError = EHConverter.convert(error);    
    return reply.status(httpResponseError.status).send(httpResponseError.toJson());
  }
};

export {
  addLineItemHandler,
  applyVoucherHandler,
  getCurrentCartHandler,
  removeLineItemHandler,
  removeVoucherHandler,
};
