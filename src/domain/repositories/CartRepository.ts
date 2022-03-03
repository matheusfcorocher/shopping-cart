import { Cart } from "../entities";

interface CartRepository {
    getAllCarts(): Promise<Array<Cart>>
    getCartById(id : string) : Promise<Cart>
    getCartByBuyerId(buyerId : string) : Promise<Cart>
    getNextId() : string;
    update(cart : Cart) : Promise<Cart>
    delete(cart: Cart) : Promise<string>
}

export { CartRepository };