import { Cart } from "../../domain/entities";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
export default class AddLineItem {
  cartRepository: CartRepository;
  productRepository: ProductRepository;

  constructor(cartRepository: CartRepository, productRepository: ProductRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  public async execute(buyerId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByBuyerId(buyerId);      
    const product = await this.productRepository.getProductById(productId);
    cart.addLineItem({ productId: product.id, price: product.price });
    await this.cartRepository.update(cart);
    return cart
  }
}
