import { LineItem } from "../../../../../../src/domain/entities/Cart";
import { LineItemModel } from "../../../../../../src/infra/database/knex/models";
import { ObjectionLineItemRepository } from "../../../../../../src/infra/repositories/lineItem/ObjectionLineItemRepository";
import LineItemModelFactory from "../../../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../../../support/factories/models/ProductModelFactory";

const { setupIntegrationTest } = require("../../../../../support/setup");
const lineItemRepository = new ObjectionLineItemRepository();

describe("Infra :: LineItem :: ObjectionLineItemRepository", () => {
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
        it("returns error", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            ownerType: "cart",
          };
          const { ownerId, ownerType } = owner;
          const productId = "92d91715-34ad-449e-9b81-73f1a74ef44e";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;

          await expect(() =>
            lineItemRepository.delete(owner, productId)
          ).rejects.toThrow(notFoundError);
        });
      });
      describe("due ownerType is wrong", () => {
        it("returns error", async () => {
          const owner = {
            ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            ownerType: "order",
          };
          const { ownerId, ownerType } = owner;
          const productId = "92d91715-34ad-449e-9b81-73f1a74ef44e";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;

          await expect(() =>
            lineItemRepository.delete(owner, productId)
          ).rejects.toThrow(notFoundError);
        });
      });
      describe("due productId is wrong", () => {
        it("returns error", async () => {
          const owner = {
            ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            ownerType: "cart",
          };
          const { ownerId, ownerType } = owner;
          const productId = "92d91715-34ad-449e-9b81-73f1a74ef44a";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;

          await expect(() =>
            lineItemRepository.delete(owner, productId)
          ).rejects.toThrow(notFoundError);
        });
      });
    });
    describe("when lineItem is found", () => {
      describe("deletes lineItem from database", () => {
        it("returns correct result", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            ownerType: "cart",
          };
          const productId = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf";
          await lineItemRepository.delete(owner, productId);
          expect((await LineItemModel.query()).length).toBe(2);
        });
      });
      describe("return success message", () => {
        it("returns correct result", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            ownerType: "cart",
          };
          const productId = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf";
          expect(await lineItemRepository.delete(owner, productId)).toEqual(
            "LineItem was deleted successfully."
          );
        });
      });
    });
  });

  describe("#getAllLineItemsByOwner", () => {
    describe("When method is called", () => {
      describe("result is a array instance of lineItems", () => {
        it("returns correct result", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            ownerType: "cart",
          };
          const lineItems = await lineItemRepository.getAllLineItemsByOwner(
            owner
          );

          expect(lineItems[0]).toBeInstanceOf(LineItem);
        });
      });
      describe("result has correct length", () => {
        it("returns correct result", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            ownerType: "cart",
          };
          const lineItems = await lineItemRepository.getAllLineItemsByOwner(
            owner
          );

          expect(lineItems.length).toBe(1);
        });
      });
      describe("result returns correct array", () => {
        it("returns correct result", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            ownerType: "cart",
          };
          const lineItems = await lineItemRepository.getAllLineItemsByOwner(
            owner
          );
          const expected = [
            new LineItem("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf", 69.99, 2),
          ];

          expect(lineItems).toEqual(expect.arrayContaining(expected));
        });
      });
    });
    describe("When service is unavailable", () => {
      it("returns error", async () => {
        const owner = {
          ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          ownerType: "cart",
        };
        const error = new Error("Service Unavailable");
        lineItemRepository.getAllLineItemsByOwner = () => Promise.reject(error);

        await expect(() =>
          lineItemRepository.getAllLineItemsByOwner(owner)
        ).rejects.toThrow(error);
      });
    });
  });

  describe("#getNextId", () => {
    it("returns a uuid", () => {
      const uuid = lineItemRepository.getNextId();
      const expected = [
        expect.stringMatching(
          /^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
        ),
      ];
      expect([uuid]).toEqual(expect.arrayContaining(expected));
    });
  });

  describe("#store", () => {
    describe("store in database", () => {
      it("returns correct result", async () => {
        const owner = {
          ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fca",
          ownerType: "cart",
        };
        const lineItem = new LineItem(
          "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          69.99,
          2
        );
        await lineItemRepository.store(lineItem, owner);
        expect(
          (
            await LineItemModel.query().where({
              ...owner,
              productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            })
          ).length
        ).toBe(1);
      });
    });
    describe("result is a lineItem", () => {
      it("returns correct result", async () => {
        const owner = {
          ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fca",
          ownerType: "cart",
        };
        const lineItem = new LineItem(
          "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          69.99,
          2
        );
        const expected = await lineItemRepository.store(lineItem, owner);

        expect(lineItem).toEqual(expected);
      });
    });
  });

  describe("#update", () => {
    describe("when lineItem is not found", () => {
      describe("due ownerId is wrong", () => {
        it("returns error", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            ownerType: "cart",
          };
          const { ownerId, ownerType } = owner;
          const productId = "92d91715-34ad-449e-9b81-73f1a74ef44e";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;

          await expect(() =>
            lineItemRepository.update(owner, productId, { quantity: 3 })
          ).rejects.toThrow(notFoundError);
        });
      });
      describe("due ownerType is wrong", () => {
        it("returns error", async () => {
          const owner = {
            ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            ownerType: "order",
          };
          const { ownerId, ownerType } = owner;
          const productId = "92d91715-34ad-449e-9b81-73f1a74ef44e";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;

          await expect(() =>
            lineItemRepository.update(owner, productId, { quantity: 3 })
          ).rejects.toThrow(notFoundError);
        });
      });
      describe("due productId is wrong", () => {
        it("returns error", async () => {
          const owner = {
            ownerId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            ownerType: "cart",
          };
          const { ownerId, ownerType } = owner;
          const productId = "92d91715-34ad-449e-9b81-73f1a74ef44a";
          const notFoundError = new Error("Not Found Error");
          notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;

          await expect(() =>
            lineItemRepository.update(owner, productId, { quantity: 3 })
          ).rejects.toThrow(notFoundError);
        });
      });
    });
    describe("when lineItem is found", () => {
      describe("update lineItem from database", () => {
        it("returns correct result", async () => {
          const owner = {
            ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            ownerType: "cart",
          };
          const productId = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf";
          const expected = new LineItem(
            "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            69.99,
            3
          );

          expect(
            await lineItemRepository.update(owner, productId, { quantity: 3 })
          ).toEqual(expected);
        });
      });
    });
  });
});
