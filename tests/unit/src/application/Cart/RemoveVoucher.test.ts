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
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const voucher = new Voucher({
            id: 'aaa',
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });
          const vouchers = [voucher];

          const newCart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute('aaa');

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [];
          const voucher = new Voucher({
            id: 'aaa',
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });

          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
            appliedVoucher: appliedVoucher,
          });
          const carts = [cart];

          const vouchers = [voucher];

          const newCart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute('aaa');

          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When cart has line items", () => {
      describe("and cart doesnt have voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem('aaa', 20, 2),
            new LineItem('bbb', 40, 1),
          ];
          const cart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });
          const carts = [cart];
          const voucher = new Voucher({
            id: 'aaa',
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });
          const vouchers = [voucher];

          const newCart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute('aaa');

          expect(result).toEqual(newCart);
        });
      });
      describe("and cart has voucher", () => {
        it("returns correct cart", async () => {
          const lineItems: LineItems = [
            new LineItem('aaa', 20, 2),
            new LineItem('bbb', 40, 1),
          ];
          const voucher = new Voucher({
            id: 'aaa',
            code: "XESBQ",
            type: "fixed",
            amount: 50,
          });

          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
            appliedVoucher: appliedVoucher,
          });
          const carts = [cart];

          const vouchers = [voucher];

          const newCart = new Cart({
            id: 'aaa',
            buyerId: "aaa",
            lineItems,
          });

          const cartRepository = new FakeCartRepository(carts);
          const voucherRepository = new FakeVoucherRepository(vouchers);
          const removeVoucher = new RemoveVoucher(
            cartRepository,
            voucherRepository
          );

          const result = await removeVoucher.execute('aaa');

          expect(result).toEqual(newCart);
        });
      });
    });

    describe("When buyerId wasn't found", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [];
        const cart = new Cart({
          id: 'aaa',
          buyerId: "aaa",
          lineItems,
        });
        const carts = [cart];
        const voucher = new Voucher({
          id: 'aaa',
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
        notFoundError.message = `Cart with id bbb can't be found.`;

        expect(await removeVoucher.execute('bbb')).toEqual(
          expect.objectContaining(
            {
              id: expect.any(String),
              buyerId: expect.any(String),
              lineItems,
            }
          )
        );
      });
    });

    describe("When update the cart gives error", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [];
        const cart = new Cart({
          id: 'aaa',
          buyerId: "aaa",
          lineItems,
        });
        const carts = [cart];
        const voucher = new Voucher({
          id: 'aaa',
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

        await expect(() => removeVoucher.execute('aaa')).rejects.toThrow(error);
      });
    });
  });
});
