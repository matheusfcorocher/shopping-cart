"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListProducts_1 = __importDefault(require("../../../../../src/application/Product/ListProducts"));
const entities_1 = require("../../../../../src/domain/entities");
const FakeProductRepository_1 = require("../../../../support/repositories/FakeProductRepository");
describe("Application :: Product :: ListProducts", () => {
    describe("#execute", () => {
        describe("When execute the method", () => {
            it("returns products", async () => {
                const products = [new entities_1.Product({ id: `aaa`, name: "Chocolate", price: 20, available: 100 })];
                const productRepo = new FakeProductRepository_1.FakeProductRepository(products);
                const listProducts = new ListProducts_1.default(productRepo);
                expect(await listProducts.execute()).toEqual(products);
            });
        });
        describe("When service is unavailable", () => {
            it("returns error", async () => {
                const products = [new entities_1.Product({ id: `aaa`, name: "Chocolate", price: 20, available: 100 })];
                const productRepo = new FakeProductRepository_1.FakeProductRepository(products);
                const error = new Error("Service Unavailable");
                productRepo.getAllProducts = () => Promise.reject(error);
                const listProducts = new ListProducts_1.default(productRepo);
                await expect(() => listProducts.execute()).rejects.toThrow(error);
            });
        });
    });
});
