import { Product } from "../../domain/entities";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

export default class ListProducts {
  productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  public async execute(): Promise<Array<Product>> {
    return await this.productRepository.getAllProducts();
  }
}
