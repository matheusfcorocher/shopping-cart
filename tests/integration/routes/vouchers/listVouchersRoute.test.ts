import supertest from "supertest";
import { app } from "../../../../app";
import VoucherModelFactory from "../../../support/factories/models/VoucherModelFactory";

const { setupIntegrationTest } = require("../../../support/setup");

describe("Interfaces :: Voucher :: Routes :: ListVouchers", () => {
  describe("API :: GET /api/vouchers", () => {
    setupIntegrationTest();
    beforeEach(async () => {
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
    });

    describe("When make a request", () => {
      it("returns correct vouchers", async () => {
        const response = await supertest(app.server)
          .get("/api/vouchers")
          .expect(200);
        const expected = [
          {
            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "TEST1",
            type: "percentual",
            amount: 40,
          },
          {
            id: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            code: "TEST2",
            type: "fixed",
            amount: 40,
          },
          {
            id: "8bc94226-3e20-40cb-a507-554fabf36ffa",
            code: "TEST3",
            type: "free shipping",
            amount: 0.02,
            minValue: 50,
          },
        ];

        expect(response.body).toEqual(expect.arrayContaining(expected));
      });
    });
  });
});
