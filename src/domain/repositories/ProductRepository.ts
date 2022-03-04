import { Product } from "../entities";

interface ProductDataProps {
  name?: string;
  price?: number;
  available?: number;
}
interface ProductRepository {
  getAllProducts(): Promise<Array<Product>>;
  getProductById(id: string): Promise<Product>;
  getNextId(): string;
  update(id: string, data: ProductDataProps): Promise<Product>;
}

export { ProductRepository, ProductDataProps };
