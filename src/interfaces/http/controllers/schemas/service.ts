import { Type } from '@sinclair/typebox'
import { httpResponseError } from './cart';

const checkoutObj = Type.Object({
    cartId: Type.String(),
    buyerId: Type.String(),
    paymentMethod: Type.String(),
});

const checkoutSchema = {
    description: "Make checkout of cart with given cartId of cart, buyerId of buyer and payment method.",
    body: checkoutObj,
    response: {
      200: Type.String(),
      400: httpResponseError,
      500: httpResponseError
    },
};

export {checkoutSchema};