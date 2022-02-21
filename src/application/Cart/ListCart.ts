import { Cart } from "../../domain/entities";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { CartDomainService } from "../../domain/services/CartDomainService";

export default class ListCart {
  voucherRepository: any;
  cartRepository: any;
  productRepository: any;

  constructor(voucherRepository: any, cartRepository: any, productRepository: any) {
    this.voucherRepository = voucherRepository;
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  public async execute(id: number): Promise<Cart> {
    const cart = await this.cartRepository.getCartById(id);
    const cartService = new CartDomainService(this.voucherRepository, this.cartRepository, this.productRepository);
    return await cartService.calculate(cart);
  }
}
