import { Money } from "../valueObjects/Money";

type ProductProps = {
  id: string,
  name: string;
  price: Money;
  available: number;
};

type Product = {
  id: string,
  name: string;
  price: Money;
  available: number;
};

function isProductAvailable(product: Product) : boolean {
  return product.available > 0
}

function createProduct({ id, name, price, available}: ProductProps) : Product {
  return { id, name, price, available };
};

export { createProduct, isProductAvailable, ProductProps };
