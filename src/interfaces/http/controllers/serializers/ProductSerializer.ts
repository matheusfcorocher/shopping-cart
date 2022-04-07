import { ProductProps } from "../../../../domain/entities/Product";
import { Product } from "../../../../domain/entities/index";

type SerializedProductProps = {
  id: string,
  name: string;
  price: number;
  available: number;
}

const ProductSerializer = {
  serialize({ id, name, price, available }: Product): SerializedProductProps {
    return {
      id,
      name,
      price: price.toUnit(),
      available,
    };
  },
};

export { ProductSerializer };
