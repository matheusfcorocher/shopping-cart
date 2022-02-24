import { Cart } from "../../domain/entities";
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

  public async execute(cartId: number, code: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartById(cartId);
    const voucher = await this.voucherRepository.getVoucherByCode(code);
    const appliedVoucher = appliedFactory.fromVoucher(voucher);
    cart.applyVoucher(appliedVoucher);
    await this.cartRepository.update(cart);
    return cart
  }
}
