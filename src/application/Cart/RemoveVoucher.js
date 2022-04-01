"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoveVoucher {
    constructor(cartRepository, voucherRepository) {
        this.cartRepository = cartRepository;
        this.voucherRepository = voucherRepository;
    }
    async execute(buyerId) {
        const cart = await this.cartRepository.getCartByBuyerId(buyerId);
        cart.removeVoucher();
        await this.cartRepository.update(cart);
        return cart;
    }
}
exports.default = RemoveVoucher;
