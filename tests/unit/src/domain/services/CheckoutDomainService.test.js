"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../src/domain/entities");
const Cart_1 = require("../../../../../src/domain/entities/Cart");
const CheckoutDomainService_1 = __importDefault(require("../../../../../src/domain/services/CheckoutDomainService"));
const FakeCartRepository_1 = require("../../../../support/repositories/FakeCartRepository");
const FakeOrderRepository_1 = require("../../../../support/repositories/FakeOrderRepository");
const FakeProductRepository_1 = require("../../../../support/repositories/FakeProductRepository");
describe("Domain :: Services :: CheckoutDomainServices", () => {
    describe("#execute", () => {
        describe("when cartId doesn't exist", () => {
            it("returns not found error", async () => {
                const lineItems = [];
                const cart = new entities_1.Cart({
                    id: 'aad',
                    lineItems,
                });
                const carts = [cart];
                const products = [];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Cart with id asd can't be found.`;
                const data = {
                    cartdId: 'asd',
                    buyerId: 'aad',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(notFoundError);
            });
        });
        describe("when query in products and service is unavailable", () => {
            it("returns error", async () => {
                const lineItems = [new Cart_1.LineItem('aad', 20, 2),];
                const cart = new entities_1.Cart({
                    id: 'aad',
                    lineItems,
                });
                const carts = [cart];
                const products = [];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const error = new Error("Service Unavailable");
                productRepository.getAllProducts = () => {
                    throw error;
                };
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'aad',
                    buyerId: 'aad',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(error);
            });
        });
        describe("when a line item is not found in products data", () => {
            it("returns internal error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 2),
                    new Cart_1.LineItem('abd', 40, 1),
                ];
                const cart = new entities_1.Cart({
                    id: 'adds',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abe',
                        name: "Chocolate",
                        price: 20,
                        available: 0,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const internalError = new Error("Internal Error");
                internalError.message = `Product with id abc was not found in products data`;
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'adds',
                    buyerId: 'adds',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(internalError);
            });
        });
        describe("when request a line item but it's out of stock", () => {
            it("returns bad request error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 2),
                ];
                const cart = new entities_1.Cart({
                    id: 'cbc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 0,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const badRequestError = new Error("Bad request Error");
                badRequestError.message = `Product Chocolate is out of stock`;
                const errors = [badRequestError];
                const aggregateError = new AggregateError(errors);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'cbc',
                    buyerId: 'cbc',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(aggregateError);
            });
        });
        describe("when request a line item but its quantity surpass the quantity available of that product", () => {
            it("returns bad request error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 4),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 3,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const badRequestError = new Error("Bad request Error");
                badRequestError.message = `Can't buy the product Chocolate with quantity 4 due it's only available 3 units`;
                const errors = [badRequestError];
                const aggregateError = new AggregateError(errors);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(aggregateError);
            });
        });
        describe("when try to create order but its fail", () => {
            it("returns internal error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const error = new Error("Service Unavailable");
                orderRepository.store = () => {
                    throw error;
                };
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(error);
            });
        });
        describe("when try to update products but its fail", () => {
            it("returns internal error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const error = new Error("Service Unavailable");
                productRepository.update = () => {
                    throw error;
                };
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(error);
            });
        });
        describe("when try to delete cart but its fail", () => {
            it("returns internal error", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const error = new Error("Service Unavailable");
                cartRepository.delete = () => {
                    throw error;
                };
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(error);
            });
        });
        describe("when try to checkout cart but doesnt have any line items", () => {
            it("returns validation error", async () => {
                const lineItems = [];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const validationError = new Error('Validation Error');
                validationError.message = "cart must have line items to become a order.";
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await expect(() => checkout.execute(data)).rejects.toThrow(validationError);
            });
        });
        describe("when create order", () => {
            it("create order", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await checkout.execute(data);
                expect(orders.length).toBe(1);
            });
            it("reduce stock", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await checkout.execute(data);
                expect(products.length).toBe(1);
                expect(products[0]).toEqual(new entities_1.Product({
                    id: 'abc',
                    name: "Chocolate",
                    price: 20,
                    available: 2,
                }));
            });
            it("delete cart", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                await checkout.execute(data);
                expect(carts.length).toBe(0);
            });
            it("returns the right message", async () => {
                const lineItems = [
                    new Cart_1.LineItem('abc', 20, 3),
                ];
                const cart = new entities_1.Cart({
                    id: 'abc',
                    lineItems,
                });
                const carts = [cart];
                const products = [
                    new entities_1.Product({
                        id: 'abc',
                        name: "Chocolate",
                        price: 20,
                        available: 5,
                    }),
                ];
                const orders = [];
                const cartRepository = new FakeCartRepository_1.FakeCartRepository(carts);
                const productRepository = new FakeProductRepository_1.FakeProductRepository(products);
                const orderRepository = new FakeOrderRepository_1.FakeOrderRepository(orders);
                const checkout = new CheckoutDomainService_1.default(cartRepository, productRepository, orderRepository);
                const data = {
                    cartdId: 'abc',
                    buyerId: 'abc',
                    paymentMethod: "pix",
                };
                expect(await checkout.execute(data)).toEqual("Order created successfully!");
            });
        });
    });
});
