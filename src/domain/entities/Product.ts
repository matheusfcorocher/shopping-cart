import { Money } from "../valueObjects/Money";

type Product = {
  id: string,
  name: string;
  price: Money;
  available: number;
};

function isProductAvailable(product: Product) : boolean {
  return product.available > 0
}

function createProduct({ id, name, price, available}: Product) : Product {
  return { id, name, price, available };
};

export { Product };

export { createProduct, isProductAvailable };
