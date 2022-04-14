import { Voucher } from "../../../../../../src/domain/entities";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import ObjectionVoucherRepository from "../../../../../../src/infra/repositories/voucher/ObjectionVoucherRepository";
import VoucherModelFactory from "../../../../../support/factories/models/VoucherModelFactory";

const { setupIntegrationTest } = require("../../../../../support/setup");
const voucherRepository = new ObjectionVoucherRepository();

describe("Infra :: Voucher :: ObjectionVoucherRepository", () => {
  setupIntegrationTest();
  beforeEach(async () => {
    await VoucherModelFactory.createList([
      {
        uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
        code: "TEST1",
        type: "percentual",
        amount: 40,
      },
      {
        uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
        code: "TEST2",
        type: "fixed",
        amount: 40,
      },
      {
        uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
        code: "TEST3",
        type: "free shipping",
        amount: 2,
        minValue: 50,
      },
    ]);
  });

  describe("#getAllVouchers", () => {
    describe("When method is called", () => {
      describe("result is a array instance of vouchers", () => {
        it("returns correct result", async () => {
          const vouchers = await voucherRepository.getAllVouchers();

          expect(vouchers[0]).toBeInstanceOf(Voucher);
        });
      });
      describe("result has correct length", () => {
        it("returns correct result", async () => {
          const vouchers = await voucherRepository.getAllVouchers();

          expect(vouchers.length).toBe(3);
        });
      });
      describe("result returns correct array", () => {
        it("returns correct result", async () => {
          const vouchers = await voucherRepository.getAllVouchers();
          const expected = [
            new Voucher({
              id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
              code: "TEST1",
              type: "percentual",
              amount: createMoney(40),
            }),
            new Voucher({
              id: "92d91715-34ad-449e-9b81-73f1a74ef44e",
              code: "TEST2",
              type: "fixed",
              amount: createMoney(40),
            }),
            new Voucher({
              id: "8bc94226-3e20-40cb-a507-554fabf36ffa",
              code: "TEST3",
              type: "free shipping",
              amount: createMoney(2),
              minValue: createMoney(50),
            }),
          ];

          expect(
            JSON.stringify(
              vouchers.sort((a: Voucher, b: Voucher) =>
                a.id.localeCompare(b.id)
              )
            )
          ).toEqual(
            JSON.stringify(
              expected.sort((a: Voucher, b: Voucher) =>
                a.id.localeCompare(b.id)
              )
            )
          );
        });
      });
    });
    describe("When service is unavailable", () => {
      it("returns error", async () => {
        const error = new Error("Service Unavailable");
        voucherRepository.getAllVouchers = () => Promise.reject(error);

        await expect(() => voucherRepository.getAllVouchers()).rejects.toThrow(
          error
        );
      });
    });
  });

  describe("#getVoucherById", () => {
    describe("result is a voucher instance", () => {
      it("returns the correct result", async () => {
        const voucher = await voucherRepository.getVoucherById(
          "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf"
        );
        const expected = new Voucher({
          id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          code: "TEST1",
          type: "percentual",
          amount: createMoney(40),
        });

        expect(JSON.stringify(voucher)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When doesn't find a voucher by id", () => {
      it("returns error", async () => {
        const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd";
        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Voucher with id ${id} can't be found.`;

        await expect(() =>
          voucherRepository.getVoucherById(id)
        ).rejects.toThrow(notFoundError);
      });
    });
  });

  describe("#getVoucherByCode", () => {
    describe("result is a voucher instance", () => {
      it("returns the correct result", async () => {
        const voucher = await voucherRepository.getVoucherByCode("TEST1");
        const expected = new Voucher({
          id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
          code: "TEST1",
          type: "percentual",
          amount: createMoney(40),
        });

        expect(JSON.stringify(voucher)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When doesn't find a voucher by code", () => {
      it("returns error", async () => {
        const code = "XMAS2023";
        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Couldn't find voucher with code: ${code} in database. Verify if you are passing the correct code.`;

        await expect(() =>
          voucherRepository.getVoucherByCode(code)
        ).rejects.toThrow(notFoundError);
      });
    });
  });
  describe("#getNextId", () => {
    describe("result is a uuid", () => {
      it("returns the correct result", () => {
        const uuid = voucherRepository.getNextId();
        const expected = [
          expect.stringMatching(
            /^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
          ),
        ];
        expect([uuid]).toEqual(expect.arrayContaining(expected));
      });
    });
  });
});
