import { Cart } from "../entities";

interface CartRepository {
    getAllCarts(): Promise<Array<Cart>>
    getCartById(id : number) : Promise<Cart>
    update(cart : Cart) : Promise<Cart>
}

export { CartRepository };