import { Product } from "../../../src/domain/entities";
import { ProductRepository } from "../../../src/domain/repositories/ProductRepository";

class FakeProductRepository implements ProductRepository {
    products: Array<Product>;

    constructor(products: Array<Product>) {
        this.products = products;
    } 
    getProductById(id: number): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    getAllProducts(): Promise<Product[]> {
        return Promise.resolve(this.products);
    }
}

export {FakeProductRepository};