import { Type } from '@sinclair/typebox'
import { httpResponseError } from './cart';

const productObj = Type.Object({
    id: Type.String(),
    name: Type.String(),
    price: Type.Number(),
    available: Type.Number(),
});

const productArray = Type.Array(productObj);

const listProductsSchema = {
    description: "Get all availables products in database.",
    response: {
      200: productArray,
      400: httpResponseError,
      500: httpResponseError
    },
};

export {listProductsSchema};