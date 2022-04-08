import supertest from "supertest";
import { app } from "../../../../app";
import { ProductModel } from "../../../../src/infra/database/knex/models/ProductModel";
import ProductModelFactory from "../../../support/factories/models/ProductModelFactory";
import mockModel from "../../../support/objection";

const { setupIntegrationTest } = require("../../../support/setup");

describe("Interfaces :: Product :: Routes :: ListProducts", () => {
  describe("API :: GET /api/products", () => {
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

    describe("When make a request", () => {
      it("returns correct products", async () => {
        const response = await supertest(app.server)
          .get("/api/products")
          .expect(200);
        const expected = [
          {
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            name: "Gaming Keyboard",
            price: 79.99,
            available: 30,
          },
          {
            id: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            name: "Gaming Chair",
            price: 299.99,
            available: 30,
          },
          {
            id: "8bc94226-3e20-40cb-a507-554fabf36ffa",
            name: "Gaming Mouse",
            price: 39.99,
            available: 30,
          },
        ];

        expect(response.body).toEqual(expect.arrayContaining(expected));
      });
    });
  });
  describe("When service is unavailable", () => {
    it("returns error", async () => {
      const error = new Error("Service Unavailable");
      mockModel(ProductModel).reject(error);
      const response = await supertest(app.server)
        .get("/api/products")
        .expect(500);
      jest.restoreAllMocks();

      expect(response.body).toEqual({
        title: "Internal Server Error",
        status: 500,
        message: "Service Unavailable",
      });
    });
  });
});
