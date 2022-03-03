import { Cart } from "../../domain/entities";
import { CartRepository } from "../../domain/repositories/CartRepository";
export default class ListCart {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  public async execute(id: string): Promise<Cart> {
    return this.cartRepository.getCartById(id);
  }
}
