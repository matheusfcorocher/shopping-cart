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

  public async execute(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.getCartById(cartId);
    cart.removeVoucher();
    await this.cartRepository.update(cart);
    return cart
  }
}
