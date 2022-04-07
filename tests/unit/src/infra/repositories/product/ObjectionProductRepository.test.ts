import { Product } from "../../../../../../src/domain/entities";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import ObjectionProductRepository from "../../../../../../src/infra/repositories/product/ObjectionProductRepository";
import { DbError } from "../../../../../../src/lib/CustomError";
import ProductModelFactory from "../../../../../support/factories/models/ProductModelFactory";

const { setupIntegrationTest } = require("../../../../../support/setup");
const productRepository = new ObjectionProductRepository();

describe("Infra :: Product :: ObjectionProductRepository", () => {
  setupIntegrationTest();
  beforeEach(async () => {
    await ProductModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        name: "Gaming Keyboard",
        price: 7999,
        available: 30,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        name: "Gaming Chair",
        price: 29999,
        available: 30,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        name: "Gaming Mouse",
        price: 3999,
        available: 30,
      },
    ]);
  });

  describe("#getAllProducts", () => {
    describe("When method is called", () => {
      describe("result is a array instance of products", () => {
        it("returns correct result", async () => {
          const products = await productRepository.getAllProducts();

          expect(products[0]).toBeInstanceOf(Product);
        });
      });
      describe("result has correct length", () => {
        it("returns correct result", async () => {
          const products = await productRepository.getAllProducts();

          expect(products.length).toBe(3);
        });
      });
      describe("result returns correct array", () => {
        it("returns correct result", async () => {
          const products = await productRepository.getAllProducts();
          const expected = [
            new Product({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              name: "Gaming Keyboard",
              price: createMoney(7999),
              available: 30,
            }),
            new Product({
              id: "92d91715-34ad-449e-9b81-73f1a74ef44e",
              name: "Gaming Chair",
              price: createMoney(29999),
              available: 30,
            }),
            new Product({
              id: "8bc94226-3e20-40cb-a507-554fabf36ffa",
              name: "Gaming Mouse",
              price: createMoney(3999),
              available: 30,
            }),
          ];

          expect(JSON.stringify(products)).toEqual(JSON.stringify(expected));
        });
      });
    });
    describe("When service is unavailable", () => {
      it("returns error", async () => {
        const error = new Error("Service Unavailable");
        productRepository.getAllProducts = () => Promise.reject(error);

        await expect(() => productRepository.getAllProducts()).rejects.toThrow(
          error
        );
      });
    });
  });

  describe("#getProductById", () => {
    describe("result is a product instance", () => {
      it("returns the correct result", async () => {
        const product = await productRepository.getProductById(
          "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf"
        );
        const expected = new Product({
          id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          name: "Gaming Keyboard",
          price: createMoney(7999),
          available: 30,
        });

        expect(JSON.stringify(product)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When doesn't find a product by id", () => {
      it("returns error", async () => {
        const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd";
        const notFoundError = new DbError({
          title: "Not Found Error",
          status: 404,
          message: `Couldn't find product with id: ${id} in database. Verify if you are passing the correct productId.`,
          detail: "",
          // stack: err.stack,
        });

        await expect(() =>
          productRepository.getProductById(id)
        ).rejects.toThrow(notFoundError);
      });
    });
  });

  describe("#update", () => {
    describe("result is a product instance", () => {
      it("returns the correct result", async () => {
        const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf";
        const productData = {
          available: 28,
        };
        const product = await productRepository.update(id, productData);
        const expected = new Product({
          id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          name: "Gaming Keyboard",
          price: createMoney(7999),
          available: 28,
        });

        expect(JSON.stringify(product)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When doesn't find a product by id", () => {
      it("returns error", async () => {
        const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd";
        const productData = {
          available: 28,
        };
        const notFoundError = new DbError({
          title: "Not Found Error",
          status: 404,
          message: `Couldn't find product with id: ${id} in database. Verify if you are passing the correct productId.`,
          detail: "",
          // stack: err.stack,
        });

        await expect(() =>
          productRepository.update(id, productData)
        ).rejects.toThrow(notFoundError);
      });
    });
  });
  describe("#getNextId", () => {
    it("returns a uuid", () => {
      const uuid = productRepository.getNextId();
      const expected = [
        expect.stringMatching(
          /^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
        ),
      ];
      expect([uuid]).toEqual(expect.arrayContaining(expected));
    });
  });
});
