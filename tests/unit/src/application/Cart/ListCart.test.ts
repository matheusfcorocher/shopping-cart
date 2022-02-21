import ListProducts from "../../../../../src/application/Product/ListProducts";
import { Product } from "../../../../../src/domain/entities";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Application :: Product :: ListCart", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          //   const products = [new Product(1, "Chocolate", 20, 100)];
          //   const productRepo = new FakeProductRepository(products);
          //   const error = new Error("Service Unavailable");
          //   productRepo.getAllProducts = () => Promise.reject(error);
          //   const listProducts = new ListProducts(productRepo);
          //   await expect(() => listProducts.execute()).rejects.toThrow(error);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          //   const products = [new Product(1, "Chocolate", 20, 100)];
          //   const productRepo = new FakeProductRepository(products);
          //   const error = new Error("Service Unavailable");
          //   productRepo.getAllProducts = () => Promise.reject(error);
          //   const listProducts = new ListProducts(productRepo);
          //   await expect(() => listProducts.execute()).rejects.toThrow(error);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          //   const products = [new Product(1, "Chocolate", 20, 100)];
          //   const productRepo = new FakeProductRepository(products);
          //   const error = new Error("Service Unavailable");
          //   productRepo.getAllProducts = () => Promise.reject(error);
          //   const listProducts = new ListProducts(productRepo);
          //   await expect(() => listProducts.execute()).rejects.toThrow(error);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          //   const products = [new Product(1, "Chocolate", 20, 100)];
          //   const productRepo = new FakeProductRepository(products);
          //   const error = new Error("Service Unavailable");
          //   productRepo.getAllProducts = () => Promise.reject(error);
          //   const listProducts = new ListProducts(productRepo);
          //   await expect(() => listProducts.execute()).rejects.toThrow(error);
        });
      });
    });

    describe("When idCart wasn't found", () => {
      it("returns not found error", async () => {
        const products = [new Product(1, "Chocolate", 20, 100)];
        const productRepo = new FakeProductRepository(products);
        const listProducts = new ListProducts(productRepo);

        expect(await listProducts.execute()).toEqual(products);
      });
    });
  });
});
