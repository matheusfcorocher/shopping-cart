import { Product } from "../../../../../src/domain/entities";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Domain :: Entity :: Product", () => {
  describe("#isAvailable", () => {
    describe("if product has available more than 0", () => {
      it("returns true", () => {
        const products : Array<Product> = [];
        const productFactory = new FakeProductRepository(products);
        const product = new Product({
          id: productFactory.getNextId(),
          name: "Chocolate",
          price: createMoney(20),
          available: 100,
          }
        );
        expect(product.isAvailable()).toEqual(true);
      });
    });
    describe("if product has available less or equal than 0", () => {
      it("returns false", () => {
        const products : Array<Product> = [];
        const productFactory = new FakeProductRepository(products);
        const product = new Product({
          id: productFactory.getNextId(),
          name: "Chocolate",
          price: createMoney(20),
          available: 0,
          }
        );
        expect(product.isAvailable()).toEqual(false);
      });
    });
  });
});
