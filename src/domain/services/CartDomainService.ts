import { Cart } from "../entities";
import { ShippingDomainService } from "./ShippingDomainService";
import { SubTotalDomainService } from "./SubTotalDomainService";

class CartDomainService {
  voucherRepository: any;
  cartRepository: any;
  productRepository: any;

  constructor(voucherRepository: any, cartRepository: any, productRepository: any) {
    this.voucherRepository = voucherRepository;
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  public async calculate(cart: Cart): Promise<Cart> {
    const subTotalService = new SubTotalDomainService(this.cartRepository, this.productRepository);
    cart.subtotal = await subTotalService.calculateSubTotalCost(cart.id);
    
    const shippingService = new ShippingDomainService(this.cartRepository);
    cart.shipping = await shippingService.calculateShipping(cart.id);
    
    const voucher = await this.voucherRepository.getVoucherById(cart.voucherId);
    if(voucher.isFreeShipping())
        cart.discount = voucher.applyShippingDiscount(cart.subtotal, cart.shipping);            
    else
        cart.discount = voucher.applySubTotalDiscount(cart.subtotal);
    
    return cart;
  }
}

export { CartDomainService };
