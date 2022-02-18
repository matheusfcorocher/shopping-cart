class DiscountDomainService {
  voucherRepository: any;
  cartRepository: any;

  constructor(voucherRepository: any, cartRepository: any) {
    this.voucherRepository = voucherRepository;
    this.cartRepository = cartRepository;
  }

  public calculateDiscount(voucherId: number, cartId: number): number {
    const voucher = this.voucherRepository.getVoucherById(voucherId);
    const cart = this.cartRepository.getCartById(cartId);

    if (voucher.isPercentual()) {
      return cart.subtotal * voucher.amount;
    } else if (voucher.isFixed()) {
      return voucher.amount;
    }

    return 0;
  }
}

export { DiscountDomainService };