import { Product } from "../entities";

class ShippingDomainService {
  voucherRepository: any;
  cartRepository: any;

  constructor(voucherRepository: any, cartRepository: any) {
    this.voucherRepository = voucherRepository;
    this.cartRepository = cartRepository;
  }

  public calculateShipping(voucherId: number, cartId: number): number {
    const voucher = this.voucherRepository.getVoucherById(voucherId);
    const cart = this.cartRepository.getCartById(cartId);

    if (voucher.isFreeShipping() && cart.subtotal >= voucher.minValue) {
      return 0;
    } else if (cart.subtotal > 400) {
      return 0;
    }
    const shippingWeight: number = cart.products.reduce(
      (acc: number, product: Product) => acc + product.available
    );
    if (shippingWeight <= 10) return 30;

    return this.calculateShippingCost(shippingWeight);
  }

  private calculateShippingCost(weight: number): number {
    //If weight is above 10kg, will charge $7 for each
    //5kg that cart has
    return Math.floor((weight - 10) / 5) * 7 + 30;
  }
}

export { ShippingDomainService };
