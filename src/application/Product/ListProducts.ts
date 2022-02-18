import { Product } from "../../domain/entities";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

export default class ListProducts {
    productRepository: ProductRepository;
    
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    public async execute(): Promise<Array<Product>>{
        try {
            return await this.productRepository.getAllProducts();
        } catch (err) {
            throw err;
        }
    }
}