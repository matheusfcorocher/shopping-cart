import * as UseCase from "../../../../../src/application/Product/ListProducts";
import * as Product from "../../../../../src/domain/entities/Product";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Application :: Product :: ListProducts", () => {
  describe("When execute the method", () => {
    it("returns products", async () => {
      const products = [
        Product.createProduct({
          id: `aaa`,
          name: "Chocolate",
          price: createMoney(20),
          available: 100,
        }),
      ];
      const productRepository = new FakeProductRepository(products);
      const listProducts = UseCase.makeListProducts({ productRepository });

      expect(await listProducts()).toEqual(products);
    });
  });

  describe("When service is unavailable", () => {
    it("returns error", async () => {
      const products = [
        Product.createProduct({
          id: `aaa`,
          name: "Chocolate",
          price: createMoney(20),
          available: 100,
        }),
      ];
      const productRepository = new FakeProductRepository(products);
      const error = new Error("Service Unavailable");
      productRepository.getAllProducts = () => Promise.reject(error);
      const listProducts = UseCase.makeListProducts({ productRepository });

      await expect(() => listProducts()).rejects.toThrow(error);
    });
  });
});
