import * as Product from "../../../../../src/domain/entities/Product";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Domain :: Entity :: Product", () => {
  describe("#isAvailable", () => {
    describe("if product has available more than 0", () => {
      it("returns true", () => {
        const products : Array<Product.Product> = [];
        const productFactory = new FakeProductRepository(products);
        const product = Product.createProduct({
          id: productFactory.getNextId(),
          name: "Chocolate",
          price: createMoney(20),
          available: 100,
          }
        );
        expect(Product.isProductAvailable(product)).toEqual(true);
      });
    });
    describe("if product has available less or equal than 0", () => {
      it("returns false", () => {
        const products : Array<Product.Product> = [];
        const productFactory = new FakeProductRepository(products);
        const product = Product.createProduct({
          id: productFactory.getNextId(),
          name: "Chocolate",
          price: createMoney(20),
          available: 0,
          }
        );
        expect(Product.isProductAvailable(product)).toEqual(false);
      });
    });
  });
});
