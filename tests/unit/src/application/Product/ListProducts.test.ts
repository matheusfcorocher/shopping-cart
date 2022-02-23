import ListProducts from "../../../../../src/application/Product/ListProducts";
import { Product } from "../../../../../src/domain/entities";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Application :: Product :: ListProducts", () => {
  describe("#execute", () => {
    describe("When execute the method", () => {
      it("returns products", async () => {
        const products = [new Product({id: 1, name: "Chocolate", price: 20, available: 100})];
        const productRepo = new FakeProductRepository(products);
        const listProducts = new ListProducts(productRepo);

        expect(await listProducts.execute()).toEqual(products);
      });
    });

    describe("When service is unavailable", () => {
        it("returns error", async () => {
          const products = [new Product({id: 1, name: "Chocolate", price: 20, available: 100})];
          const productRepo = new FakeProductRepository(products);
          const error = new Error("Service Unavailable")
          productRepo.getAllProducts = () => Promise.reject(error);
          const listProducts = new ListProducts(productRepo);
  
          await expect(() => listProducts.execute()).rejects.toThrow(error);
        });
      });
  });
});
