import { Cart } from "../../domain/entities";
import { appliedFactory } from "../../domain/factories/AppliedVoucherFactory";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { VoucherRepository } from "../../domain/repositories/VoucherRepository";
export default class RemoveVoucher {
  cartRepository: CartRepository;
  voucherRepository: VoucherRepository;

  constructor(cartRepository: CartRepository, voucherRepository: VoucherRepository) {
    this.cartRepository = cartRepository;
    this.voucherRepository = voucherRepository;
  }

  public async execute(buyerId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByBuyerId(buyerId);
    cart.removeVoucher();
    await this.cartRepository.update(cart);
    return cart
  }
}
