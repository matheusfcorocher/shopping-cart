import { Product } from "../entities";

interface ProductRepository {
    getAllProducts(): Promise<Array<Product>>
    getProductById(id:number) : Promise<Product>
}

export { ProductRepository };