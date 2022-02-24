import ApplyVoucher from "../../../../../src/application/Cart/ApplyVoucher";
import RemoveVoucher from "../../../../../src/application/Cart/RemoveVoucher";
import { Cart, Voucher } from "../../../../../src/domain/entities";
import { LineItems, LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Application :: Cart :: RemoveVoucher", () => {
  describe("#execute", () => {
    describe("When cart doesn't have any line item", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const cart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });
          const carts = [cart];
          const voucher = new Voucher({
            id: 1,
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });
          const vouchers = [voucher];

          const newCart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute(1);

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const voucher = new Voucher({
            id: 1,
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });

          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id: 1,
            lineItems,
            appliedVoucher: appliedVoucher,
            state: "CREATED",
          });
          const carts = [cart];

          const vouchers = [voucher];

          const newCart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute(1);

          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem(1, 20, 2),
            new LineItem(2, 40, 1),
          ];
          const cart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });
          const carts = [cart];
          const voucher = new Voucher({
            id: 1,
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });
          const vouchers = [voucher];

          const newCart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute(1);

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem(1, 20, 2),
            new LineItem(2, 40, 1),
          ];
          const voucher = new Voucher({
            id: 1,
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });

          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id: 1,
            lineItems,
            appliedVoucher: appliedVoucher,
            state: "CREATED",
          });
          const carts = [cart];

          const vouchers = [voucher];

          const newCart = new Cart({
            id: 1,
            lineItems,
            state: "CREATED",
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute(1);

          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When cartId wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [];
        const cart = new Cart({
          id: 1,
          lineItems,
          state: "CREATED",
        });
        const carts = [cart];
        const voucher = new Voucher({
          id: 1,
          code: "XESBQ",
          type: "fixed",
          amount: 50,
        });
        const vouchers = [voucher];

        const cartRepository = new FakeCartRepository(carts);
        const voucherRepository = new FakeVoucherRepository(vouchers);
        const removeVoucher = new RemoveVoucher(
          cartRepository,
          voucherRepository
        );

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id 2 can't be found.`;

        await expect(() => removeVoucher.execute(2)).rejects.toThrow(
          notFoundError
        );
      });
    });

    describe("When update the cart gives error", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [];
        const cart = new Cart({
          id: 1,
          lineItems,
          state: "CREATED",
        });
        const carts = [cart];
        const voucher = new Voucher({
          id: 1,
          code: "XESBQ",
          type: "fixed",
          amount: 50,
        });
        const vouchers = [voucher];

        const error = new Error("Service Unavailable");

        const cartRepository = new FakeCartRepository(carts);
        cartRepository.update = () => {
          throw error;
        };
        const voucherRepository = new FakeVoucherRepository(vouchers);
        const removeVoucher = new RemoveVoucher(
          cartRepository,
          voucherRepository
        );

        await expect(() => removeVoucher.execute(1)).rejects.toThrow(error);
      });
    });
  });
});
