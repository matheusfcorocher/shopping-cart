import { CartRepository } from "../repositories/CartRepository";
import { ProductRepository } from "../repositories/ProductRepository";

class SubTotalDomainService {
  cartRepository: CartRepository;
  productRepository: ProductRepository;

  constructor(cartRepository: any, productRepository: any) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  public async calculateSubTotalCost(cartId: number): Promise<number> {
    const cart = await this.cartRepository.getCartById(cartId);
    return cart.lineItems.reduce((acc: Promise<number>, item) => {
      return acc.then((a: number) =>
        this.productRepository
          .getProductById(item.productId)
          .then((product) => a + product.price * item.quantity)
      );
    }, Promise.resolve(0));
  }
}

export { SubTotalDomainService };
