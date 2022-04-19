import * as Cart from "../../domain/entities/Cart";
import { appliedFactory } from "../../domain/factories/AppliedVoucherFactory";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { VoucherRepository } from "../../domain/repositories/VoucherRepository";

type makeApplyVoucherProps = {
  cartRepository: CartRepository;
  voucherRepository: VoucherRepository;
};

type applyVoucherProps = {
  buyerId: string;
  code: string;
};

function makeApplyVoucher({
  cartRepository,
  voucherRepository,
}: makeApplyVoucherProps) {
  async function applyVoucher({
    buyerId,
    code,
  }: applyVoucherProps): Promise<Cart.Cart> {
    const cart = await cartRepository.getCartByBuyerId(buyerId);
    const voucher = await voucherRepository.getVoucherByCode(code);
    const appliedVoucher = appliedFactory.fromVoucher(voucher);
    Cart.applyVoucher(cart, appliedVoucher);
    await cartRepository.update(cart);
    return cart;
  }

  return applyVoucher;
}


export { applyVoucherProps };

export { makeApplyVoucher };

