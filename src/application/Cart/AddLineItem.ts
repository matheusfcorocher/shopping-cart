import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
export default class AddLineItem {
  cartRepository: CartRepository;
  productRepository: ProductRepository;

  constructor(cartRepository: CartRepository, productRepository: ProductRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  public async execute(buyerId: string, productId: string): Promise<Cart.Cart> {
    const cart = await this.cartRepository.getCartByBuyerId(buyerId);      
    const product = await this.productRepository.getProductById(productId);
    Cart.addLineItem(cart, { productId: product.id, price: product.price });
    await this.cartRepository.update(cart);
    return cart
  }
}
