import { Cart } from "../entities";

interface CartRepository {
    getAllCarts(): Promise<Array<Cart>>
    getCartById(id : number) : Promise<Cart>
}

export { CartRepository };