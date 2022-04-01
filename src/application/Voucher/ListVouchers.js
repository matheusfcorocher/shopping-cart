"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListVouchers {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        return await this.productRepository.getAllVouchers();
    }
}
exports.default = ListVouchers;
