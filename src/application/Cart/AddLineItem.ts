import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

type makeAddLineItemProps = {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
};

type addLineItemProps = {
  buyerId: string;
  productId: string;
};

function makeAddLineItem({
  cartRepository,
  productRepository,
}: makeAddLineItemProps) {
  async function addLineItem({
    buyerId,
    productId,
  }: addLineItemProps): Promise<Cart.Cart> {
    const cart = await cartRepository.getCartByBuyerId(buyerId);
    const product = await productRepository.getProductById(productId);
    const cartWithAddedItem = Cart.addLineItem(cart, { productId: product.id, price: product.price });
    return cartRepository.update(cartWithAddedItem);
  }

  return addLineItem;
}

export { addLineItemProps };

export { makeAddLineItem };