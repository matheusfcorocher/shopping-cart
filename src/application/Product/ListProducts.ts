import * as Product from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

export default class ListProducts {
  productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  public async execute(): Promise<Array<Product.Product>> {
    return await this.productRepository.getAllProducts();
  }
}
