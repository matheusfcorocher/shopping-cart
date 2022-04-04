import { Type } from '@sinclair/typebox'

const productObj = Type.Object({
    id: Type.String(),
    name: Type.String(),
    price: Type.Number(),
    available: Type.Number(),
});

const productArray = Type.Array(productObj);

const listProductsSchema = {
    response: {
      200: productArray,
    },
};

export {listProductsSchema};