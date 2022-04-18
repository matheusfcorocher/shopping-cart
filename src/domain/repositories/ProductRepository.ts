import { Product } from "../entities/Product";
import { Money } from "../valueObjects/Money";

interface ProductDataProps {
  name?: string;
  price?: Money;
  available?: number;
}
interface ProductRepository {
  getAllProducts(): Promise<Array<Product>>;
  getProductById(id: string): Promise<Product>;
  getNextId(): string;
  update(id: string, data: ProductDataProps): Promise<Product>;
}

export { ProductRepository, ProductDataProps };
