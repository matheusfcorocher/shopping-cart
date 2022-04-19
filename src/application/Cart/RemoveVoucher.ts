import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";
export default class RemoveVoucher {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async execute(buyerId: string): Promise<Cart.Cart> {
    const cart = await this.cartRepository.getCartByBuyerId(buyerId);
    Cart.removeVoucher(cart);
    await this.cartRepository.update(cart);
    return cart
  }
}
