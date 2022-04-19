import * as Product from "../../../../domain/entities/Product";

type SerializedProductProps = {
  id: string,
  name: string;
  price: number;
  available: number;
}

const ProductSerializer = {
  serialize({ id, name, price, available }: Product.Product): SerializedProductProps {
    return {
      id,
      name,
      price: price.toUnit(),
      available,
    };
  },
};

export { ProductSerializer };
