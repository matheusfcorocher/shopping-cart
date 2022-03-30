import { FastifyRequest, FastifyReply } from "fastify";
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
    const { buyerId, productId } = req.body;
    const result = await addLineItem.execute(buyerId, productId);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
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
    const { buyerId, code } = req.body;
    const result = await applyVoucher.execute(buyerId, code);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
  }
};

const getCurrentCartHandler = async (
  req: FastifyRequest<{
    Params: {
      buyerId: string;
    }
  }>,
  reply: FastifyReply
) => {
  try {
    const { getCurrentCart } = req.container.carts;
    const { buyerId } = req.params;
    const result = await getCurrentCart.execute(buyerId);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
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
    const { buyerId, productId } = req.body;
    const result = await removeLineItem.execute(buyerId, productId);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
  }
};

const removeVoucherHandler = async (
  req: FastifyRequest<{
    Params: {
      buyerId: string;
    }
  }>,
  reply: FastifyReply
) => {
  try {
    const { removeVoucher } = req.container.carts;
    const { buyerId } = req.params;
    const result = await removeVoucher.execute(buyerId);
    reply.send(CartSerializer.serialize(result));
  } catch (error: any) {
    switch (error.CODE) {
      default:
        const { message, details } = error;
        return reply.status(500).send({ message, details });
    }
  }
};

export { addLineItemHandler, applyVoucherHandler, getCurrentCartHandler, removeLineItemHandler, removeVoucherHandler};
