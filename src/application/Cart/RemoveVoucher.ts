import { Cart } from "../../domain/entities";
import { CartRepository } from "../../domain/repositories/CartRepository";
export default class RemoveVoucher {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async execute(buyerId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByBuyerId(buyerId);
    cart.removeVoucher();
    await this.cartRepository.update(cart);
    return cart
  }
}
