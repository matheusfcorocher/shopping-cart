import { ObjectionCartRepository } from "../../../../../../src/infra/repositories/cart/ObjectionCartRepository";
import LineItemModelFactory from "../../../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../../../support/factories/models/ProductModelFactory";

const { setupIntegrationTest } = require("../../../../../support/setup");
const cartRepository = new ObjectionCartRepository();

describe("Infra :: Cart :: ObjectionCartRepository", () => {
  setupIntegrationTest();
  beforeEach(async () => {
    await ProductModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        name: "Gaming Keyboard",
        price: 79.99,
        available: 30,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        name: "Gaming Chair",
        price: 299.99,
        available: 30,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        name: "Gaming Mouse",
        price: 39.99,
        available: 30,
      },
    ]);
    await LineItemModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        unitPrice: 69.99,
        quantity: 2,
        ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        ownerType: "cart",
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        unitPrice: 299.99,
        quantity: 2,
        ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        ownerType: "cart",
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        unitPrice: 39.99,
        quantity: 2,
        ownerId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        ownerType: "cart",
      },
    ]);
  });

  describe("#delete", () => {
    describe("when lineItem is not found", () => {
      describe("due ownerId is wrong", () => {
        it("returns error", async () => {});
        describe("due ownerType is wrong", () => {
          it("returns error", async () => {});
        });
        describe("due productId is wrong", () => {
          it("returns error", async () => {});
        });
      });
      describe("when lineItem is found", () => {
        describe("deletes lineItem from database", () => {
          it("returns correct result", async () => {});
          describe("return success message", () => {
            it("returns correct result", async () => {});
          });
        });
      });
    });
  });
});
