"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetCurrentCart {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(buyerId) {
        return this.cartRepository.getCartByBuyerId(buyerId);
    }
}
exports.default = GetCurrentCart;
