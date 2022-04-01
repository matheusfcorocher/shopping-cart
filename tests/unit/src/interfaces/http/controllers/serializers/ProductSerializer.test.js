"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../../src/domain/entities");
const ProductSerializer_1 = require("../../../../../../../src/interfaces/http/controllers/serializers/ProductSerializer");
describe("Interfaces :: HTTP :: Product :: ProductSerializer", () => {
    it("returns id, name, price and available", () => {
        const product = new entities_1.Product({
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            name: "Chocolate",
            price: 29.99,
            available: 100,
        });
        const expected = {
            id: "2a20283a-2371-441f-af6e-899fe63def5c",
            name: "Chocolate",
            price: 29.99,
            available: 100,
        };
        expect(ProductSerializer_1.ProductSerializer.serialize(product)).toEqual(expected);
    });
});
