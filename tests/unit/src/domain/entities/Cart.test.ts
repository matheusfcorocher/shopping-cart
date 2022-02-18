import { Cart, Product } from "../../../../../src/domain/entities";

describe("Domain :: Entity :: Cart", () => {
  describe("#isFinished", () => {
    describe("when cart has state equals FINISHED", () => {
      it("returns true", () => {
        // const products = [
        //   new Product(1, "Chocolate", 20, 100),
        //   new Product(2, "Marshmellow", 30, 50),
        // ];
        // const cart = new Cart(
        //   1,
        //   products,
        //   1,
        //   "FINISHED",
        // );
        // expect(cart.isFinished()).toEqual(true);
      });
    });
    describe("when cart doesn´t have state equals FINISHED", () => {
      it("returns false", () => {
        // const products = [
        //   entityFactory.productCreatorMachine().create({
        //     id: 1,
        //     name: "Chocolate",
        //     price: 20,
        //     available: 100,
        //   }),
        //   entityFactory.productCreatorMachine().create({
        //     id: 2,
        //     name: "Marshmellow",
        //     price: 30,
        //     available: 50,
        //   }),
        // ];
        // const cart = entityFactory.cartCreatorMachine().create({
        //   id: 1,
        //   products: products,
        //   voucher: 1,
        //   state: "CREATED",
        // });
        // expect(cart.isFinished()).toEqual(false);
      });
    });
  });
});
