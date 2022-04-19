import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";

type makeRemoveVoucherProps = {
  cartRepository: CartRepository;
};

function makeRemoveVoucher({ cartRepository }: makeRemoveVoucherProps) {
  async function removeVoucher(buyerId: string): Promise<Cart.Cart> {
    const cart = await cartRepository.getCartByBuyerId(buyerId);
    Cart.removeVoucher(cart);
    await cartRepository.update(cart);
    return cart;
  }

  return removeVoucher;
}

export { makeRemoveVoucher };
