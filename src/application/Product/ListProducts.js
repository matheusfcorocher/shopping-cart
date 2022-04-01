"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListProducts {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        return await this.productRepository.getAllProducts();
    }
}
exports.default = ListProducts;
