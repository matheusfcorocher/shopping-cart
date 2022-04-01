"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoveLineItem {
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(buyerId, productId) {
        const cart = await this.cartRepository.getCartByBuyerId(buyerId);
        await this.productRepository.getProductById(productId);
        cart.removeLineItem(productId);
        await this.cartRepository.update(cart);
        return cart;
    }
}
exports.default = RemoveLineItem;
