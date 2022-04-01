"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const ObjectionProductRepository_1 = __importDefault(require("../../../../../../src/infra/repositories/product/ObjectionProductRepository"));
const ProductModelFactory_1 = __importDefault(require("../../../../../support/factories/models/ProductModelFactory"));
const { setupIntegrationTest } = require("../../../../../support/setup");
const productRepository = new ObjectionProductRepository_1.default();
describe("Infra :: Product :: ObjectionProductRepository", () => {
    setupIntegrationTest();
    beforeEach(async () => {
        await ProductModelFactory_1.default.createList([
            {
                uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                name: "Gaming Keyboard",
                price: 79.99,
                available: 30,
            },
            {
                uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                name: "Gaming Chair",
                price: 299.99,
                available: 30,
            },
            {
                uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                name: "Gaming Mouse",
                price: 39.99,
                available: 30,
            },
        ]);
    });
    describe("#getAllProducts", () => {
        describe("When method is called", () => {
            describe("result is a array instance of products", () => {
                it("returns correct result", async () => {
                    const products = await productRepository.getAllProducts();
                    expect(products[0]).toBeInstanceOf(entities_1.Product);
                });
            });
            describe("result has correct length", () => {
                it("returns correct result", async () => {
                    const products = await productRepository.getAllProducts();
                    expect(products.length).toBe(3);
                });
            });
            describe("result returns correct array", () => {
                it("returns correct result", async () => {
                    const products = await productRepository.getAllProducts();
                    const expected = [
                        new entities_1.Product({
                            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                            name: "Gaming Keyboard",
                            price: 79.99,
                            available: 30,
                        }),
                        new entities_1.Product({
                            id: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                            name: "Gaming Chair",
                            price: 299.99,
                            available: 30,
                        }),
                        new entities_1.Product({
                            id: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                            name: "Gaming Mouse",
                            price: 39.99,
                            available: 30,
                        }),
                    ];
                    expect(products).toEqual(expect.arrayContaining(expected));
                });
            });
        });
        describe("When service is unavailable", () => {
            it("returns error", async () => {
                const error = new Error("Service Unavailable");
                productRepository.getAllProducts = () => Promise.reject(error);
                await expect(() => productRepository.getAllProducts()).rejects.toThrow(error);
            });
        });
    });
    describe("#getProductById", () => {
        describe("result is a product instance", () => {
            it("returns the correct result", async () => {
                const product = await productRepository.getProductById("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf");
                const expected = new entities_1.Product({
                    id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    name: "Gaming Keyboard",
                    price: 79.99,
                    available: 30,
                });
                expect(product).toEqual(expected);
            });
        });
        describe("When doesn't find a product by id", () => {
            it("returns error", async () => {
                const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd";
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Product with id ${id} can't be found.`;
                await expect(() => productRepository.getProductById(id)).rejects.toThrow(notFoundError);
            });
        });
    });
    describe("#update", () => {
        describe("result is a product instance", () => {
            it("returns the correct result", async () => {
                const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf";
                const productData = {
                    available: 28,
                };
                const product = await productRepository.update(id, productData);
                const expected = new entities_1.Product({
                    id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    name: "Gaming Keyboard",
                    price: 79.99,
                    available: 28,
                });
                expect(product).toEqual(expected);
            });
        });
        describe("When doesn't find a product by id", () => {
            it("returns error", async () => {
                const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd";
                const productData = {
                    available: 28,
                };
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Product with id ${id} can't be found.`;
                await expect(() => productRepository.update(id, productData)).rejects.toThrow(notFoundError);
            });
        });
    });
    describe("#getNextId", () => {
        it("returns a uuid", () => {
            const uuid = productRepository.getNextId();
            const expected = [
                expect.stringMatching(/^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/),
            ];
            expect([uuid]).toEqual(expect.arrayContaining(expected));
        });
    });
});
