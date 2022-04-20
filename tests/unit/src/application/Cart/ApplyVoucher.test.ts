import * as UseCase from "../../../../../src/application/Cart/ApplyVoucher";
import * as Cart from "../../../../../src/domain/entities/Cart";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Application :: Cart :: ApplyVoucher", () => {
  describe("When cart doesn't have any line item", () => {
    describe("and cart doesnt have voucher", () => {
      it("returns correct cart", async () => {
        const lineItems: Cart.LineItems = [];
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
        });
        const carts = [cart];
        const voucher = Voucher.createVoucher({
          id: "aaa",
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });
        const vouchers = [voucher];

        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const newCart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher: appliedVoucher,
        });

        const cartRepository = new FakeCartRepository(carts);
        const voucherRepository = new FakeVoucherRepository(vouchers);
        const applyVoucher = UseCase.makeApplyVoucher({
          cartRepository,
          voucherRepository,
        });

        const result = await applyVoucher({ buyerId: "aaa", code: "XESBQ" });

        expect(result).toEqual(newCart);
      });
    });
    describe("and cart has voucher", () => {
      it("returns correct cart", async () => {
        const lineItems: Cart.LineItems = [];
        const voucher = Voucher.createVoucher({
          id: "aaa",
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher: appliedVoucher,
        });
        const carts = [cart];
        const voucher2 = Voucher.createVoucher({
          id: "aaa",
          code: "AKITANDO",
          type: "percentual",
          amount: createMoney(50),
        });
        const vouchers = [voucher, voucher2];

        const appliedVoucher2 = appliedFactory.fromVoucher(voucher2);

        const newCart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher: appliedVoucher2,
        });

        const cartRepository = new FakeCartRepository(carts);
        const voucherRepository = new FakeVoucherRepository(vouchers);
        const applyVoucher = UseCase.makeApplyVoucher({
          cartRepository,
          voucherRepository,
        });

        const result = await applyVoucher({ buyerId: "aaa", code: "AKITANDO" });

        expect(result).toEqual(newCart);
      });
    });
  });

  describe("When cart has line items", () => {
    describe("and cart doesnt have voucher", () => {
      it("returns correct cart", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "aaa",
            unitPrice: createMoney(20),
            quantity: 2,
          }),
          Cart.createLineItem({
            productId: "bbb",
            unitPrice: createMoney(40),
            quantity: 1,
          }),
        ];
        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
        });
        const carts = [cart];
        const voucher = Voucher.createVoucher({
          id: "aaa",
          code: "AKITANDO",
          type: "percentual",
          amount: createMoney(50),
        });
        const vouchers = [voucher];

        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const newCart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher: appliedVoucher,
        });

        const cartRepository = new FakeCartRepository(carts);
        const voucherRepository = new FakeVoucherRepository(vouchers);
        const applyVoucher = UseCase.makeApplyVoucher({
          cartRepository,
          voucherRepository,
        });

        const result = await applyVoucher({ buyerId: "aaa", code: "AKITANDO" });

        expect(result).toEqual(newCart);
      });
    });
    describe("and cart has voucher", () => {
      it("returns correct cart", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "aaa",
            unitPrice: createMoney(20),
            quantity: 2,
          }),
          Cart.createLineItem({
            productId: "bbb",
            unitPrice: createMoney(40),
            quantity: 1,
          }),
        ];
        const voucher = Voucher.createVoucher({
          id: "aaa",
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher: appliedVoucher,
        });
        const carts = [cart];
        const voucher2 = Voucher.createVoucher({
          id: "bbb",
          code: "AKITANDO",
          type: "percentual",
          amount: createMoney(50),
        });
        const vouchers = [voucher, voucher2];

        const appliedVoucher2 = appliedFactory.fromVoucher(voucher2);

        const newCart = Cart.createCart({
          id: "aaa",
          buyerId: "aaa",
          lineItems,
          appliedVoucher: appliedVoucher2,
        });

        const cartRepository = new FakeCartRepository(carts);
        const voucherRepository = new FakeVoucherRepository(vouchers);
        const applyVoucher = UseCase.makeApplyVoucher({
          cartRepository,
          voucherRepository,
        });

        const result = await applyVoucher({ buyerId: "aaa", code: "AKITANDO" });

        expect(result).toEqual(newCart);
      });
    });
  });

  describe("When buyerId wasn't found", () => {
    it("returns correct cart", async () => {
      const lineItems: Cart.LineItems = [];
      const cart = Cart.createCart({
        id: "aaa",
        buyerId: "aaa",
        lineItems,
      });
      const carts = [cart];
      const voucher = Voucher.createVoucher({
        id: "aaa",
        code: "XESBQ",
        type: "fixed",
        amount: createMoney(50),
      });
      const vouchers = [voucher];
      const appliedVoucher = appliedFactory.fromVoucher(voucher);

      const cartRepository = new FakeCartRepository(carts);
      const voucherRepository = new FakeVoucherRepository(vouchers);
      const applyVoucher = UseCase.makeApplyVoucher({
        cartRepository,
        voucherRepository,
      });

      expect(await applyVoucher({ buyerId: "bbb", code: "XESBQ" })).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          buyerId: expect.any(String),
          lineItems: [],
          appliedVoucher,
        })
      );
    });
  });
  describe("When voucher code wasn't found", () => {
    it("returns not found error", async () => {
      const lineItems: Cart.LineItems = [];
      const cart = Cart.createCart({
        id: "aaa",
        buyerId: "aaa",
        lineItems,
      });
      const carts = [cart];
      const voucher = Voucher.createVoucher({
        id: "aaa",
        code: "XESBB",
        type: "fixed",
        amount: createMoney(50),
      });
      const vouchers = [voucher];

      const cartRepository = new FakeCartRepository(carts);
      const voucherRepository = new FakeVoucherRepository(vouchers);
      const applyVoucher = UseCase.makeApplyVoucher({
        cartRepository,
        voucherRepository,
      });

      const notFoundError = new Error("Not Found Error");
      notFoundError.message = `Voucher with code XESBQ can't be found.`;

      await expect(() =>
        applyVoucher({ buyerId: "aaa", code: "XESBQ" })
      ).rejects.toThrow(notFoundError);
    });
  });
  describe("When update the cart gives error", () => {
    it("returns error", async () => {
      const lineItems: Cart.LineItems = [];
      const cart = Cart.createCart({
        id: "aaa",
        buyerId: "aaa",
        lineItems,
      });
      const carts = [cart];
      const voucher = Voucher.createVoucher({
        id: "aaa",
        code: "XESBQ",
        type: "fixed",
        amount: createMoney(50),
      });
      const vouchers = [voucher];

      const error = new Error("Service Unavailable");

      const cartRepository = new FakeCartRepository(carts);
      cartRepository.update = () => {
        throw error;
      };
      const voucherRepository = new FakeVoucherRepository(vouchers);
      const applyVoucher = UseCase.makeApplyVoucher({
        cartRepository,
        voucherRepository,
      });

      await expect(() =>
        applyVoucher({ buyerId: "aaa", code: "XESBQ" })
      ).rejects.toThrow(error);
    });
  });
});
