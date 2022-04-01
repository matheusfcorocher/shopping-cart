"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const ProductModel_1 = require("../../../../../../src/infra/database/knex/models/ProductModel");
const ObjectionProductMapper_1 = require("../../../../../../src/infra/repositories/product/ObjectionProductMapper");
describe("Infra :: Product :: ObjectionProductMapper", () => {
    describe(".toEntity", () => {
        it("returns product instance with product model passed", () => {
            const productModel = new ProductModel_1.ProductModel();
            const productObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                name: "Avocado",
                price: 9.99,
                available: 100,
            };
            productModel.$setJson(productObject);
            const { uuid, name, price, available } = productObject;
            const expected = new entities_1.Product({
                id: uuid,
                name,
                price,
                available,
            });
            expect(ObjectionProductMapper_1.ObjectionProductMapper.toEntity(productModel)).toEqual(expected);
        });
    });
    describe(".toDatabase", () => {
        it("returns prepared object to be persisted", () => {
            const productObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                name: "Avocado",
                price: 9.99,
                available: 100,
            };
            const { uuid, name, price, available } = productObject;
            const product = new entities_1.Product({
                id: uuid,
                name,
                price,
                available,
            });
            const expected = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                name: "Avocado",
                price: 9.99,
                available: 100,
            };
            expect(ObjectionProductMapper_1.ObjectionProductMapper.toDatabase(product)).toEqual(expected);
        });
    });
});
