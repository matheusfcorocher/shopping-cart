import { v4 as uuidv4 } from 'uuid';
import { Product } from "../../../src/domain/entities";
import { ProductDataProps, ProductRepository } from "../../../src/domain/repositories/ProductRepository";

class FakeProductRepository implements ProductRepository {
  products: Array<Product>;

  constructor(products: Array<Product>) {
    this.products = products;
  }
  public update(id: string, data: ProductDataProps): Promise<Product> {
    const product = this.products.filter((p) => p.id === id)[0];
    const updatedProduct = new Product({
      ...product,
      ...data
    });
    const index = this.products.findIndex((p) => p.id === id)
    this.products.splice(index, 1, updatedProduct);
    return Promise.resolve(product);
  }
  public getNextId(): string {
    return uuidv4();
  }
  public getProductById(id: string): Promise<Product> {
    const result = this.products.filter((cargo) => cargo.id.normalize() === id.normalize())[0];
    if (result === undefined) {
      const notFoundError = new Error("Not Found Error");
    //   notFoundError.CODE = "NOTFOUND_ERROR";
      notFoundError.message = `Product with id ${id} can't be found.`;
      return Promise.reject(notFoundError);
    }
    return Promise.resolve(result);
  }
  public getAllProducts(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }
}

export { FakeProductRepository };
