import { Product } from "../entities";

interface ProductRepository {
    getAllProducts(): Promise<Array<Product>>
    getProductById(id:string) : Promise<Product>
    getNextId() : string;
}

export { ProductRepository };