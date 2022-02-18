import ListVouchers from "../../../../../src/application/Voucher/ListVouchers";
import { Voucher } from "../../../../../src/domain/entities";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Application :: Voucher :: ListVouchers", () => {
  describe("#execute", () => {
    describe("When execute the method", () => {
      it("returns products", async () => {
        const products = [new Voucher(1, "#X321", "fixed", 100)];
        const productRepo = new FakeVoucherRepository(products);
        const listVouchers = new ListVouchers(productRepo);

        expect(await listVouchers.execute()).toEqual(products);
      });
    });

    describe("When service is unavailable", () => {
        it("returns error", async () => {
          const products = [new Voucher(1, "#X322", "percentual", 100)];
          const productRepo = new FakeVoucherRepository(products);
          const error = new Error("Service Unavailable")
          productRepo.getAllVouchers = () => Promise.reject(error);
          const listVouchers = new ListVouchers(productRepo);
  
          await expect(() => listVouchers.execute()).rejects.toThrow(error);
        });
      });
  });
});
