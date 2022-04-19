import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";

type makeGetCurrentCartProps = {
  cartRepository: CartRepository;
};

function makeGetCurrentCart({
  cartRepository,
}: makeGetCurrentCartProps) {
  async function getCurrentCart(buyerId: string): Promise<Cart.Cart> {
    return cartRepository.getCartByBuyerId(buyerId);
  }

  return getCurrentCart;
}

export { makeGetCurrentCartProps };

export { makeGetCurrentCart };
