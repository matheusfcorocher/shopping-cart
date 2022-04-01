"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../src/domain/entities");
const FakeProductRepository_1 = require("../../../../support/repositories/FakeProductRepository");
describe("Domain :: Entity :: Product", () => {
    describe("#isAvailable", () => {
        describe("if product has available more than 0", () => {
            it("returns true", () => {
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const product = new entities_1.Product({
                    id: productFactory.getNextId(),
                    name: "Chocolate",
                    price: 20,
                    available: 100,
                });
                expect(product.isAvailable()).toEqual(true);
            });
        });
        describe("if product has available less or equal than 0", () => {
            it("returns false", () => {
                const products = [];
                const productFactory = new FakeProductRepository_1.FakeProductRepository(products);
                const product = new entities_1.Product({
                    id: productFactory.getNextId(),
                    name: "Chocolate",
                    price: 20,
                    available: 0,
                });
                expect(product.isAvailable()).toEqual(false);
            });
        });
    });
});
