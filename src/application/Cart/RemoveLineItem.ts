import * as Cart from "../../domain/entities/Cart";
import { CartRepository } from "../../domain/repositories/CartRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

type makeRemoveLineItemProps = {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
};

type removeLineItemProps = {
  buyerId: string;
  productId: string;
};

function makeRemoveLineItem({
  cartRepository,
  productRepository,
}: makeRemoveLineItemProps) {
  async function removeLineItem({
    buyerId,
    productId,
  }: removeLineItemProps): Promise<Cart.Cart> {
    const cart = await cartRepository.getCartByBuyerId(buyerId);
    await productRepository.getProductById(productId);
    const cartRemovedItem = Cart.removeLineItem(cart, productId);
    return  cartRepository.update(cartRemovedItem);
  }

  return removeLineItem;
}


export { removeLineItemProps };

export { makeRemoveLineItem };
