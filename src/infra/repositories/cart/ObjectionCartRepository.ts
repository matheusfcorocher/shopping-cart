import { Cart } from "../../../domain/entities";
import { CartRepository } from "../../../domain/repositories/CartRepository";

class ObjectionCartRepository implements CartRepository {
    getAllCarts(): Promise<Cart[]> {
        throw new Error("Method not implemented.");
    }
    getCartById(id: string): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
    getCartByBuyerId(buyerId: string): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
    getNextId(): string {
        throw new Error("Method not implemented.");
    }
    update(cart: Cart): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
    delete(cart: Cart): Promise<string> {
        throw new Error("Method not implemented.");
    }

}

export { ObjectionCartRepository };