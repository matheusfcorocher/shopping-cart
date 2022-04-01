"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppliedVoucherFactory_1 = require("../../domain/factories/AppliedVoucherFactory");
class ApplyVoucher {
    constructor(cartRepository, voucherRepository) {
        this.cartRepository = cartRepository;
        this.voucherRepository = voucherRepository;
    }
    async execute(buyerId, code) {
        const cart = await this.cartRepository.getCartByBuyerId(buyerId);
        const voucher = await this.voucherRepository.getVoucherByCode(code);
        const appliedVoucher = AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
        cart.applyVoucher(appliedVoucher);
        await this.cartRepository.update(cart);
        return cart;
    }
}
exports.default = ApplyVoucher;
