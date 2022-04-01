"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddLineItem {
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(buyerId, productId) {
        const cart = await this.cartRepository.getCartByBuyerId(buyerId);
        const product = await this.productRepository.getProductById(productId);
        cart.addLineItem({ productId: product.id, price: product.price });
        await this.cartRepository.update(cart);
        return cart;
    }
}
exports.default = AddLineItem;
