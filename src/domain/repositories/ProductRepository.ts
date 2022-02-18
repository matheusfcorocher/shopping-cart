import { Product } from "../entities";

interface ProductRepository {
    getAllProducts(): Promise<Array<Product>>
    // getProductById(id:number) : Product
}

export { ProductRepository };