import * as UseCase from "../../../../../src/application/Voucher/ListVouchers";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Application :: Voucher :: ListVouchers", () => {
  describe("When execute the method", () => {
    it("returns vouchers", async () => {
      const vouchers = [
        Voucher.createVoucher({
          id: `aaa`,
          code: "#X321",
          type: "fixed",
          amount: createMoney(100),
        }),
      ];
      const voucherRepository = new FakeVoucherRepository(vouchers);
      const listVouchers = UseCase.makeListVouchers({ voucherRepository });

      expect(await listVouchers()).toEqual(vouchers);
    });
  });

  describe("When service is unavailable", () => {
    it("returns error", async () => {
      const vouchers = [
        Voucher.createVoucher({
          id: `aaa`,
          code: "#X322",
          type: "percentual",
          amount: createMoney(100),
        }),
      ];
      const voucherRepository = new FakeVoucherRepository(vouchers);
      const error = new Error("Service Unavailable");
      voucherRepository.getAllVouchers = () => Promise.reject(error);
      const listVouchers = UseCase.makeListVouchers({ voucherRepository });

      await expect(() => listVouchers()).rejects.toThrow(error);
    });
  });
});
