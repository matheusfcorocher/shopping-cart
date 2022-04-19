import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";
export default class GetCurrentCart {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async execute(buyerId: string): Promise<Cart.Cart> {
    return this.cartRepository.getCartByBuyerId(buyerId);
  }
}
