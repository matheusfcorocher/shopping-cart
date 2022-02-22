import { Product } from "../../../src/domain/entities";
import { ProductRepository } from "../../../src/domain/repositories/ProductRepository";

class FakeProductRepository implements ProductRepository {
  products: Array<Product>;

  constructor(products: Array<Product>) {
    this.products = products;
  }
  getProductById(id: number): Promise<Product> {
    const result = this.products.filter((cargo) => cargo.id === id)[0];
    if (result === undefined) {
      const notFoundError = new Error("Not Found Error");
    //   notFoundError.CODE = "NOTFOUND_ERROR";
      notFoundError.message = `Product with id ${id} can't be found.`;
      return Promise.reject(notFoundError);
    }
    return Promise.resolve(result);
  }
  getAllProducts(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }
}

export { FakeProductRepository };
