import {
  Cart,
  Voucher,
  Buyer,
  Product,
} from "../../../../../src/domain/entities";
import { LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeBuyerRepository } from "../../../../support/repositories/FakeBuyerRepository";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Domain :: Entity :: Cart", () => {
  const carts: Array<Cart> = [];
  const cartFactory = new FakeCartRepository(carts);

  const buyers: Array<Buyer> = [];
  const buyerFactory = new FakeBuyerRepository(buyers);

  const products: Array<Product> = [];
  const productFactory = new FakeProductRepository(products);

  const vouchers: Array<Voucher> = [];
  const voucherFactory = new FakeVoucherRepository(vouchers);

  describe("#addLineItem", () => {
    describe("When cart has lineItem with quantity different from 0", () => {
      it("returns the quantity plus 1 ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 2)];
        const lineItemsAnswer = [new LineItem(lineItemId, createMoney(20), 3)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });

        const answer = new Cart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });
        const lineItemData = {
          productId: lineItemId,
          price: createMoney(20),
        };
        cart.addLineItem(lineItemData);

        expect(JSON.stringify(cart)).toEqual(JSON.stringify(answer));
      });
    });

    describe("When cart doesnt have lineItem", () => {
      it("returns the cart with lineItem ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems: Array<LineItem> = [];
        const lineItemsAnswer = [new LineItem(lineItemId, createMoney(20), 1)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });

        const answer = new Cart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });
        const lineItemData = {
          productId: lineItemId,
          price: createMoney(20),
        };
        cart.addLineItem(lineItemData);

        expect(JSON.stringify(cart)).toEqual(JSON.stringify(answer));
      });
    });
  });
  describe("#applyVoucher", () => {
    describe("When cart doesnt have any voucher", () => {
      it("returns the same cart with voucher", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const answer = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });

        cart.applyVoucher(appliedVoucher);

        expect(cart).toEqual(answer);
      });
    });
    describe("When cart has voucher", () => {
      it("returns cart with voucher that was applied", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const voucher2 = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESSQ",
          type: "percentual",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const appliedVoucher2 = appliedFactory.fromVoucher(voucher2);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const answer = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher: appliedVoucher2,
        });

        cart.applyVoucher(appliedVoucher2);
        expect(cart).toEqual(answer);
      });
    });
  });
  describe("#removeLineItem", () => {
    describe("When productId is not found in cart", () => {
      it("returns not found error", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const error = new Error(
          "Item with productId 3dsa wasn't found in cart!"
        );

        expect(() => cart.removeLineItem("3dsa")).toThrow(error);
      });
    });

    describe("When cart has lineItem with quantity different from 0", () => {
      it("returns the quantity minus 1 ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];
        const lineItemsAnswer = [new LineItem(lineItemId, createMoney(20), 2)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });

        const answer = new Cart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });

        cart.removeLineItem(lineItemId);

        expect(JSON.stringify(cart)).toEqual(JSON.stringify(answer));
      });
    });

    describe("When cart has lineItem with quantity 1", () => {
      it("returns the cart without lineItem ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 1)];
        const lineItemsAnswer: Array<LineItem> = [];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });

        const answer = new Cart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });

        cart.removeLineItem(lineItemId);

        expect(cart).toEqual(answer);
      });
    });
  });
  describe("#removeVoucher", () => {
    describe("When cart doesnt have any voucher", () => {
      it("returns the same cart", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const answer = new Cart({
          id,
          buyerId,
          lineItems,
        });

        cart.removeVoucher();

        expect(cart).toEqual(answer);
      });
    });
    describe("When cart has voucher", () => {
      it("returns cart without voucher", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const answer = new Cart({
          id,
          buyerId,
          lineItems,
        });

        cart.removeVoucher();

        expect(cart).toEqual(answer);
      });
    });
  });

  describe("#discount", () => {
    describe("When cart doesnt have any voucher applied", () => {
      it("returns the correct discount", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const discount = cart.discount;
        const expected = createMoney(0);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has fixed voucher applied", () => {
      it("returns the correct discount", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(5000),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20), 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const discount = cart.discount;
        const expected = createMoney(5000);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has percentual voucher applied", () => {
      it("returns the correct discount", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "percentual",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });

        const discount = cart.discount;
        const expected = createMoney(3000);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has free shipping voucher applied", () => {
      it("returns the correct discount", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "free shipping",
          minValue: createMoney(5000),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });

        const discount = cart.discount;
        const expected = createMoney(3000);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
  });
  describe("#subtotal", () => {
    describe("When cart has lineItems", () => {
      it("returns the correct subtotal", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(6000);

        expect(JSON.stringify(cart.subtotal)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart doesnt have lineItems", () => {
      it("returns 0 in subtotal", () => {
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(5000),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems: Array<LineItem> = [];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const expected = createMoney(0);

        expect(JSON.stringify(cart.subtotal)).toEqual(JSON.stringify(expected));
      });
    });
  });
  describe("#shipping", () => {
    describe("When cart has subtotal that is greater than $400.00", () => {
      it("returns $0 for shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(20000), 3)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(0);

        expect(JSON.stringify(cart.shipping)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has subtotal that equals $0.00", () => {
      it("returns $0 for shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems: Array<LineItem> = [];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(0);

        expect(JSON.stringify(cart.shipping)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has shipping weight less or equal than 10kg", () => {
      it("returns $30 for shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(2000), 10)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(3000);

        expect(JSON.stringify(cart.shipping)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has shipping weight greater than 10kg", () => {
      it("returns the correct shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, createMoney(1000), 20)];

        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(3000 + 2 * 700);

        expect(JSON.stringify(cart.shipping)).toEqual(JSON.stringify(expected));
      });
    });
  });
  describe("#total", () => {
    describe("When cart has lineItems", () => {
      describe("and has fixed voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();
          const voucher = new Voucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "fixed",
            amount: createMoney(5000),
          });

          const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(4000);

          expect(JSON.stringify(cart.total)).toEqual(JSON.stringify(expected));
        });
      });
      describe("and has percentual voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();
          const voucher = new Voucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "percentual",
            amount: createMoney(50),
          });

          const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(6000);

          expect(JSON.stringify(cart.total)).toEqual(JSON.stringify(expected));
        });
      });
      describe("and has free shipping voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const voucher = new Voucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "free shipping",
            minValue: createMoney(5000),
          });

          const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(6000);

          expect(JSON.stringify(cart.total)).toEqual(JSON.stringify(expected));
        });
      });
      describe("and doesn't have voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems = [new LineItem(lineItemId, createMoney(2000), 3)];

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
          });
          const expected = createMoney(9000);

          expect(JSON.stringify(cart.total)).toEqual(JSON.stringify(expected));
        });
      });
    });
    describe("When cart doesnt have lineItems", () => {
      describe("and has fixed voucher applied", () => {
        it("returns 0 in total", () => {
          const voucher = new Voucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "fixed",
            amount: createMoney(5000),
          });

          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<LineItem> = [];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(cart.subtotal)).toEqual(
            JSON.stringify(expected)
          );
        });
      });
      describe("and has percentual voucher applied", () => {
        it("returns 0 in total", () => {
          const voucher = new Voucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "percentual",
            amount: createMoney(50),
          });

          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<LineItem> = [];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(cart.subtotal)).toEqual(
            JSON.stringify(expected)
          );
        });
      });
      describe("and has free shipping voucher applied", () => {
        it("returns 0 in total", () => {
          const voucher = new Voucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "free shipping",
            minValue: createMoney(5000),
          });

          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<LineItem> = [];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(cart.subtotal)).toEqual(
            JSON.stringify(expected)
          );
        });
      });
      describe("and doesn't have voucher applied", () => {
        it("returns 0 in total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<LineItem> = [];

          const cart = new Cart({
            id,
            buyerId,
            lineItems,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(cart.subtotal)).toEqual(
            JSON.stringify(expected)
          );
        });
      });
    });
  });
});
