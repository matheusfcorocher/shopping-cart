import { v4 as uuidv4 } from 'uuid';
import * as Product from "../../../src/domain/entities/Product";
import { ProductDataProps, ProductRepository } from "../../../src/domain/repositories/ProductRepository";

class FakeProductRepository implements ProductRepository {
  products: Array<Product.Product>;

  constructor(products: Array<Product.Product>) {
    this.products = products;
  }

  public getAllProducts(): Promise<Product.Product[]> {
    return Promise.resolve(this.products);
  }

  public getNextId(): string {
    return uuidv4();
  }
  public getProductById(id: string): Promise<Product.Product> {
    const result = this.products.find((cargo) => cargo.id.normalize() === id.normalize());
    if (result === undefined) {
      const notFoundError = new Error("Not Found Error");
    //   notFoundError.CODE = "NOTFOUND_ERROR";
      notFoundError.message = `Product with id ${id} can't be found.`;
      return Promise.reject(notFoundError);
    }
    return Promise.resolve(result);
  }

  public update(id: string, data: ProductDataProps): Promise<Product.Product> {
    const product = this.products.find((p) => p.id === id);
    const updatedProduct = Product.createProduct({
      ...product!,
      ...data
    });
    const index = this.products.findIndex((p) => p.id === id)
    this.products.splice(index, 1, updatedProduct);
    return Promise.resolve(product!);
  }
 
}

export { FakeProductRepository };
