import { Product } from "../entities";

class ShippingDomainService {
  cartRepository: any;

  constructor(cartRepository: any) {
    this.cartRepository = cartRepository;
  }

  public async calculateShipping(cartId: number): Promise<number> {
    const cart = await this.cartRepository.getCartById(cartId);
    if (cart.subtotal > 400) {
      return 0;
    }
    const shippingWeight : number = cart.calculateCartWeight();
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
