import supertest from "supertest";
import { app } from "../../../../app";
import { CartModel } from "../../../../src/infra/database/knex/models/CartModel";
import { OrderModel } from "../../../../src/infra/database/knex/models/OrderModel";
import ObjectionProductRepository from "../../../../src/infra/repositories/product/ObjectionProductRepository";
import { ProductSerializer } from "../../../../src/interfaces/http/controllers/serializers/ProductSerializer";
import BuyerModelFactory from "../../../support/factories/models/BuyerModelFactory";
import CartModelFactory from "../../../support/factories/models/CartModelFactory";
import LineItemModelFactory from "../../../support/factories/models/LineItemModelFactory";
import ProductModelFactory from "../../../support/factories/models/ProductModelFactory";
import VoucherModelFactory from "../../../support/factories/models/VoucherModelFactory";

const { setupIntegrationTest } = require("../../../support/setup");

describe("Interfaces :: Services :: Routes :: Checkout", () => {
  describe("API :: POST /api/checkout", () => {
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
          available: 0,
        },
        {
          uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
          name: "Gaming Mouse",
          price: 3999,
          available: 30,
        },
        {
          uuid: "c444a231-6ecb-4b78-aa12-99ad202df255",
          name: "Gaming Monitor",
          price: 40099,
          available: 1,
        },
      ]);
      await LineItemModelFactory.createList([
        {
          uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          unitPrice: 7999,
          quantity: 2,
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
          productId: "c444a231-6ecb-4b78-aa12-99ad202df255",
          unitPrice: 40099,
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

    describe("when cartId doesn't exist", () => {
      it("returns not found error", async () => {
        const data = {
          cartId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          paymentMethod: "pix",
        };
        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(404);

        const notFoundError = {
          title: "Not Found Error",
          status: 404,
          message: `Couldn't find cart with id: ${data.cartId} in database. Verify if you are passing the correct id.`,
          detail:
            'select "carts".* from "carts" where "uuid" = $1 - invalid input syntax for type uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx"',
          hasManyErrors: false,
        };

        expect(response.body).toEqual(notFoundError);
      });
    });

    describe("when try to checkout cart but doesnt have any line items", () => {
      it("returns validation error", async () => {
        const data = {
          cartId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
          paymentMethod: "pix",
        };
        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(400);

        const badRequestError = {
          title: "Bad request Error",
          status: 400,
          message: "cart must have line items to become a order.",
          hasManyErrors: false,
        };

        expect(response.body).toEqual(badRequestError);
      });
    });

    describe("when request a line item but it's out of stock", () => {
      const data = {
        cartId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
        buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
        paymentMethod: "pix",
      };
      it("returns bad request error", async () => {
        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(400);

        const expected = {
          title: "Bad Request Error",
          status: 400,
          hasManyErrors: true,
          message:
            "Was found multiple errors in the request. See property errors for details.",
        };
        const responseWithoutErrors = {
          ...response.body,
          errors: undefined,
        };

        expect(responseWithoutErrors).toEqual(expected);
      });
      it("returns correct errors", async () => {
        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(400);

        const expectedErrors = [
          {
            code: "BADREQUEST_ERROR",
            message: "Product Gaming Chair is out of stock",
            title: "Bad request Error",
          },
          {
            code: "BADREQUEST_ERROR",
            message: `Can't buy the product Gaming Monitor with quantity 2 due it's only available 1 units`,
            title: "Bad request Error",
          },
        ];

        expect(response.body.errors).toEqual(
          expect.arrayContaining(expectedErrors)
        );
      });
    });

    describe("when request a line item but its quantity surpass the quantity available of that product", () => {
      const data = {
        cartId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
        buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
        paymentMethod: "credit card",
      };

      it("returns bad request error", async () => {
        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(400);

        const expected = {
          title: "Bad Request Error",
          status: 400,
          hasManyErrors: true,
          message:
            "Was found multiple errors in the request. See property errors for details.",
        };
        const responseWithoutErrors = {
          ...response.body,
          errors: undefined,
        };

        expect(responseWithoutErrors).toEqual(expected);
      });
      it("returns correct errors", async () => {
        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(400);

        const expectedErrors = [
          {
            code: "BADREQUEST_ERROR",
            message: "Product Gaming Chair is out of stock",
            title: "Bad request Error",
          },
          {
            code: "BADREQUEST_ERROR",
            message: `Can't buy the product Gaming Monitor with quantity 2 due it's only available 1 units`,
            title: "Bad request Error",
          },
        ];

        expect(response.body.errors).toEqual(
          expect.arrayContaining(expectedErrors)
        );
      });
    });

    describe("when create order", () => {
      it("create order", async () => {
        const data = {
          cartId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          paymentMethod: "pix",
        };

        await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(200);

        const ordersLength = (await OrderModel.query()).length;

        expect(ordersLength).toEqual(1);
      });
      it("reduce stock", async () => {
        const data = {
          cartId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          paymentMethod: "pix",
        };

        await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(200);

        const productRepo = ObjectionProductRepository;
        const product = ProductSerializer.serialize(
          await productRepo.getProductById(
            "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf"
          )
        );

        expect(product).toEqual({
          id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          name: "Gaming Keyboard",
          price: 79.99,
          available: 28,
        });
      });

      it("delete cart", async () => {
        const data = {
          cartId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          paymentMethod: "pix",
        };

        await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(200);

        const cartsLength = (await CartModel.query()).length;

        expect(cartsLength).toEqual(3);
      });
      it("returns the right message", async () => {
        const data = {
          cartId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          paymentMethod: "pix",
        };

        const response = await supertest(app.server)
          .post("/api/checkout")
          .send(data)
          .set("Content-type", "application/json")
          .expect(200);

        expect(response.text).toEqual("Order created successfully!");
      });
    });
  });
});
