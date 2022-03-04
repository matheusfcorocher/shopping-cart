import { Cart } from "../../domain/entities";
import { CartRepository } from "../../domain/repositories/CartRepository";
export default class GetCurrentCart {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async execute(buyerId: string): Promise<Cart> {
    return this.cartRepository.getCartByBuyerId(buyerId);
  }
}
