import supertest from "supertest";
import { app } from "../../../../app";
import BuyerModelFactory from "../../../support/factories/models/BuyerModelFactory";
import CartModelFactory from "../../../support/factories/models/CartModelFactory";
import LineItemModelFactory from "../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../support/factories/models/ProductModelFactory";
import VoucherModelFactory from "../../../support/factories/models/VoucherModelFactory";

const { setupIntegrationTest } = require("../../../support/setup");

describe("Interfaces :: Cart :: Routes :: RemoveLineItem", () => {
  describe("API :: PUT /api/carts/removeLineItem", () => {
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
      await LineItemModelFactory.createList([
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          unitPrice: 7999,
          quantity: 1,
          ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          ownerType: "cart",
        },
        {
          uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
          productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
          unitPrice: 29999,
          quantity: 2,
          ownerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
          ownerType: "cart",
        },
        {
          uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
          productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
          unitPrice: 3999,
          quantity: 2,
          ownerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
          ownerType: "cart",
        },
      ]);
      await BuyerModelFactory.createList([
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          name: "Matheus",
          birthDate: new Date(1999, 8, 2),
          email: "matheus@gmail.com",
          postalCode: "142005-203",
          street: "Rua do teste",
          district: "Bairro do teste",
          city: "Piracicaba",
          country: "Brazil",
        },
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
          name: "Matheus",
          birthDate: new Date(1999, 8, 2),
          email: "matheus2@gmail.com",
          postalCode: "142005-201",
          street: "Rua do teste",
          district: "Bairro do teste",
          city: "Piracicaba",
          country: "Brazil",
        },
        {
          uuid: "45f815f4-a7fd-4e80-89eb-45113d9537df",
          name: "Matheus",
          birthDate: new Date(1999, 8, 2),
          email: "matheus3@gmail.com",
          postalCode: "142005-201",
          street: "Rua do teste",
          district: "Bairro do teste",
          city: "Piracicaba",
          country: "Brazil",
        },
        {
          uuid: "dc60209d-1feb-4465-b936-882e93bcd0c9",
          name: "Matheus",
          birthDate: new Date(1999, 8, 2),
          email: "matheus4@gmail.com",
          postalCode: "142005-201",
          street: "Rua do teste",
          district: "Bairro do teste",
          city: "Piracicaba",
          country: "Brazil",
        },
      ]);
      await VoucherModelFactory.createList([
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          code: "TEST1",
          type: "percentual",
          amount: 4000,
        },
        {
          uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
          code: "TEST2",
          type: "fixed",
          amount: 4000,
        },
        {
          uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
          code: "TEST3",
          type: "free shipping",
          amount: 2,
          minValue: 5000,
        },
      ]);
      await CartModelFactory.createList([
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          type: "fixed",
          amount: 5000,
        },
        {
          uuid: "dc60209d-1feb-4465-b936-882e93bcd0c9",
          buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
        },
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
        },
        {
          uuid: "45f815f4-a7fd-4e80-89eb-45113d9537df",
          buyerId: "45f815f4-a7fd-4e80-89eb-45113d9537df",
          voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          type: "fixed",
          amount: 5000,
        },
      ]);
    });

    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns internal server error", async () => {
          const data = {
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
            productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          };
          const response = await supertest(app.server)
            .put("/api/carts/removeLineItem")
            .send(data)
            .set("Content-type", "application/json")
            .expect(500);

          const notFoundError = {
            title: "Internal Server Error",
            status: 500,
            message: `Item with productId ${data.productId} wasn't found in cart!`,
          };

          expect(response.body).toEqual(notFoundError);
        });
      });
      describe("and cart has voucher", () => {
        it("returns internal server error", async () => {
          const data = {
            buyerId: "45f815f4-a7fd-4e80-89eb-45113d9537df",
            productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          };

          const response = await supertest(app.server)
            .put("/api/carts/removeLineItem")
            .send(data)
            .set("Content-type", "application/json")
            .expect(500);

          const notFoundError = {
            title: "Internal Server Error",
            status: 500,
            message: `Item with productId ${data.productId} wasn't found in cart!`,
          };

          expect(response.body).toEqual(notFoundError);
        });
      });
    });
    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const data = {
            buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
            productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
          };
          const response = await supertest(app.server)
            .put("/api/carts/removeLineItem")
            .send(data)
            .set("Content-type", "application/json")
            .expect(200);
          const expected = {
            id: "dc60209d-1feb-4465-b936-882e93bcd0c9",
            buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
            lineItems: [
              {
                productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                unitPrice: 299.99,
                quantity: 2,
              },
              {
                productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                unitPrice: 39.99,
                quantity: 1,
              },
            ],
            appliedVoucher: null,
            discount: 0,
            shipping: 0,
            subtotal: 639.97,
            total: 639.97,
          };

          expect(response.body).toEqual(expected);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const data = {
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          };
          const response = await supertest(app.server)
            .put("/api/carts/removeLineItem")
            .send(data)
            .set("Content-type", "application/json")
            .expect(200);

          const expected = {
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            lineItems: [],
            appliedVoucher: {
              voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              type: "fixed",
              amount: 50,
            },
            discount: 50,
            shipping: 0,
            subtotal: 0,
            total: 0,
          };

          expect(response.body).toEqual(expected);
        });
      });
    });
    describe("When buyerId wasn't found", () => {
      it("returns correct cart", async () => {
        const data = {
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx",
          productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        };
        const response = await supertest(app.server)
          .put("/api/carts/removeLineItem")
          .send(data)
          .set("Content-type", "application/json")
          .expect(404);

        const notFoundError = {
          title: "Not Found Error",
          status: 404,
          message: `Couldn't find cart with buyerId: ${data.buyerId} in database. Verify if you are passing the correct buyerId.`,
          detail:
            'select "carts".* from "carts" where "buyerId" = $1 - invalid input syntax for type uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx"',
        };

        expect(response.body).toEqual(notFoundError);
      });
    });
    describe("When productId wasn't found'", () => {
      it("returns error", async () => {
        const data = {
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx",
        };
        const response = await supertest(app.server)
          .put("/api/carts/removeLineItem")
          .send(data)
          .set("Content-type", "application/json")
          .expect(404);
        const notFoundError = {
          title: "Not Found Error",
          status: 404,
          message: `Couldn't find product with id: ${data.productId} in database. Verify if you are passing the correct productId.`,
          detail:
            'select "products".* from "products" where "uuid" = $1 - invalid input syntax for type uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx"',
        };

        expect(response.body).toEqual(notFoundError);
      });
    });
  });
});
