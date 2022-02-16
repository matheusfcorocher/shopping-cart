import { ConcreteEntityFactory } from "../../../../support/factories/data";
const entityFactory = new ConcreteEntityFactory();

describe("Domain :: Entity :: Product", () => {
  describe("#isAvailable", () => {
    describe("if product has available more than 0", () => {
      it("returns true", () => {
        const product = entityFactory.productCreatorMachine().create({
          id: 1,
          name: "Chocolate",
          price: 20,
          available: 100,
        });
        expect(product.isAvailable()).toEqual(true);
      });
    });
    describe("if product has available less or equal than 0", () => {
      it("returns false", () => {
        const product = entityFactory.productCreatorMachine().create({
          id: 1,
          name: "Chocolate",
          price: 20,
          available: 0,
        });
        expect(product.isAvailable()).toEqual(false);
      });
    });
  });
});
