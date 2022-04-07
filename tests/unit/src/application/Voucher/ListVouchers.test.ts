import ListVouchers from "../../../../../src/application/Voucher/ListVouchers";
import { Voucher } from "../../../../../src/domain/entities";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Application :: Voucher :: ListVouchers", () => {
  describe("#execute", () => {
    describe("When execute the method", () => {
      it("returns products", async () => {
        const products = [new Voucher({id: `aaa`, code: "#X321", type: "fixed", amount: createMoney(100)})];
        const productRepo = new FakeVoucherRepository(products);
        const listVouchers = new ListVouchers(productRepo);

        expect(await listVouchers.execute()).toEqual(products);
      });
    });

    describe("When service is unavailable", () => {
        it("returns error", async () => {
          const products = [new Voucher({id: `aaa`, code: "#X322", type: "percentual", amount: createMoney(100)})];
          const productRepo = new FakeVoucherRepository(products);
          const error = new Error("Service Unavailable")
          productRepo.getAllVouchers = () => Promise.reject(error);
          const listVouchers = new ListVouchers(productRepo);
  
          await expect(() => listVouchers.execute()).rejects.toThrow(error);
        });
      });
  });
});
