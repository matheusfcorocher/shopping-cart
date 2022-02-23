import { Cart } from "../../domain/entities";
import { LineItem } from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";
export default class AddLineItem {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async execute(id: number, lineItem: LineItem): Promise<Cart> {
    const cart = await this.cartRepository.getCartById(id);
    cart.addLineItem(lineItem);
    await this.cartRepository.update(cart);
    return cart
  }
}
