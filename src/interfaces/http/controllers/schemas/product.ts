import { Type } from '@sinclair/typebox'

const productObj = Type.Object({
    id: Type.String(),
    name: Type.String(),
    price: Type.Number(),
    available: Type.Number(),
});

const listProductsSchema = {
    response: {
      200: {
        type: "array",
        items: productObj,
      },
    },
};

export {listProductsSchema};