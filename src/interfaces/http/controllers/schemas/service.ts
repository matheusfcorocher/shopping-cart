import { Type } from '@sinclair/typebox'

const checkoutObj = Type.Object({
    cartId: Type.String(),
    buyerId: Type.String(),
    paymentMethod: Type.String(),
});

const checkoutSchema = {
    body: {
        type: 'object',
        required: ['cartId', 'buyerId', 'paymentMethod'],
        properties: checkoutObj,
    },
    response: {
      200: Type.String()
    },
};

export {checkoutSchema};