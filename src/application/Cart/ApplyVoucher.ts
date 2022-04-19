import * as Cart from "../../domain/entities/Cart";
import { appliedFactory } from "../../domain/factories/AppliedVoucherFactory";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { VoucherRepository } from "../../domain/repositories/VoucherRepository";
export default class ApplyVoucher {
  cartRepository: CartRepository;
  voucherRepository: VoucherRepository;

  constructor(cartRepository: CartRepository, voucherRepository: VoucherRepository) {
    this.cartRepository = cartRepository;
    this.voucherRepository = voucherRepository;
  }

  public async execute(buyerId: string, code: string): Promise<Cart.Cart> {
    const cart = await this.cartRepository.getCartByBuyerId(buyerId);
    const voucher = await this.voucherRepository.getVoucherByCode(code);
    const appliedVoucher = appliedFactory.fromVoucher(voucher);
    Cart.applyVoucher(cart, appliedVoucher);
    await this.cartRepository.update(cart);
    return cart
  }
}
