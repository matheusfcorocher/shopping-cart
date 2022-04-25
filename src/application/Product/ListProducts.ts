import * as Product from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

type makeListProductsProps = {
  productRepository: ProductRepository;
};

function makeListProducts({
  productRepository,
}: makeListProductsProps) {
  function listProducts(): Promise<Array<Product.Product>> {
    return productRepository.getAllProducts();
  }

  return listProducts;
}

export { makeListProductsProps };

export { makeListProducts };

