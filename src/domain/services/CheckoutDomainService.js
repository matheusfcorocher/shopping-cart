"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../entities");
class CheckoutDomainService {
    constructor(cartRepository, productRepository, orderRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }
    async execute(data) {
        const cart = await this.cartRepository.getCartById(data.cartdId);
        const validationError = new Error('Validation Error');
        validationError.message = "cart must have line items to become a order.";
        if (cart.lineItems.length == 0)
            throw validationError;
        const products = await this.productRepository.getAllProducts();
        const productsData = products.map((product) => {
            const { id, name, available } = product;
            return { productId: id, name, available };
        });
        this.verifyAvailability(cart, productsData);
        const orderId = this.orderRepository.getNextId();
        const orderData = this.convertCartToOrderData(cart, data);
        const order = new entities_1.Order({
            ...orderData,
            id: orderId,
        });
        await this.orderRepository.store(order);
        await this.stockReduction(cart, products);
        await this.cartRepository.delete(cart);
        return "Order created successfully!";
    }
    convertCartToOrderData(cart, data) {
        const { lineItems, discount } = cart;
        const { buyerId, paymentMethod } = data;
        return {
            buyerId,
            lineItems,
            discount,
            paymentMethod,
        };
    }
    async stockReduction(cart, products) {
        const updatedProducts = this.updateProducts(cart, products);
        const promises = [];
        for (let product of updatedProducts) {
            const { id, available } = product;
            promises.push(this.productRepository.update(id, { available }));
        }
        await Promise.all(promises);
        return Promise.resolve("Products stock were updated successfully!");
    }
    updateProducts(cart, products) {
        const updatedProducts = products.map((product) => {
            const lineItem = cart.lineItems.find((lineItem) => product.id == lineItem.productId);
            if (lineItem) {
                product.available = product.available - lineItem.quantity;
            }
            return product;
        });
        return updatedProducts;
    }
    verifyAvailability(cart, productsData) {
        const buying = cart.lineItems.map((lineItem) => {
            const product = productsData.find((productData) => productData.productId == lineItem.productId);
            if (product) {
                if (lineItem.quantity > product.available)
                    return {
                        canBuy: false,
                        message: product.available == 0
                            ? `Product ${product.name} is out of stock`
                            : `Can't buy the product ${product.name} with quantity ${lineItem.quantity} due it's only available ${product.available} units`,
                    };
                return {
                    canBuy: true,
                };
            }
            const internalError = new Error("Internal Error");
            internalError.message = `Product with id ${lineItem.productId} was not found in products data`;
            throw internalError;
        });
        const messageErrors = buying.reduce((acc, b) => {
            if (b.canBuy)
                return [...acc];
            else
                return [...acc, b.message];
        }, []);
        if (messageErrors.length === 0)
            return true;
        const errors = messageErrors.map((m) => {
            const badRequestError = new Error("Bad request Error");
            badRequestError.message = m;
            return badRequestError;
        });
        const aggregateError = new AggregateError(errors);
        throw aggregateError;
    }
}
exports.default = CheckoutDomainService;
