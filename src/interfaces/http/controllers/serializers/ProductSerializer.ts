import { ProductProps } from "../../../../domain/entities/Product";
import { Product } from "../../../../domain/entities/index";

const ProductSerializer = {
  serialize({ id, name, price, available }: Product): ProductProps {
    return {
      id,
      name,
      price,
      available,
    };
  },
};

export { ProductSerializer };
