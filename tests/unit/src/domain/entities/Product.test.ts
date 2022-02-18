import { Product } from "../../../../../src/domain/entities";

describe("Domain :: Entity :: Product", () => {
  describe("#isAvailable", () => {
    describe("if product has available more than 0", () => {
      it("returns true", () => {
        const product = new Product(
          1,
          "Chocolate",
          20,
          100,
        );
        expect(product.isAvailable()).toEqual(true);
      });
    });
    describe("if product has available less or equal than 0", () => {
      it("returns false", () => {
        const product = new Product(
          1,
          "Chocolate",
          20,
          0,
        );
        expect(product.isAvailable()).toEqual(false);
      });
    });
  });
});
