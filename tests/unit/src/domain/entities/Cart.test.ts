import * as Cart from "../../../../../src/domain/entities/Cart";
import * as Buyer from "../../../../../src/domain/entities/Buyer";
import * as Product from "../../../../../src/domain/entities/Product";
import * as Voucher from "../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import { FakeBuyerRepository } from "../../../../support/repositories/FakeBuyerRepository";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Domain :: Entity :: Cart", () => {
  const carts: Array<Cart.Cart> = [];
  const cartFactory = new FakeCartRepository(carts);

  const buyers: Array<Buyer.Buyer> = [];
  const buyerFactory = new FakeBuyerRepository(buyers);

  const products: Array<Product.Product> = [];
  const productFactory = new FakeProductRepository(products);

  const vouchers: Array<Voucher.Voucher> = [];
  const voucherFactory = new FakeVoucherRepository(vouchers);

  describe("#addLineItem", () => {
    describe("When cart has lineItem with quantity different from 0", () => {
      it.only("returns the quantity plus 1 ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [
          Cart.createLineItem({
            productId: lineItemId,
            unitPrice: createMoney(20),
            quantity: 2,
          }),
        ];
        const lineItemsAnswer = [
          Cart.createLineItem({
            productId: lineItemId,
            unitPrice: createMoney(20),
            quantity: 3,
          }),
        ];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });

        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });
        const lineItemData = {
          productId: lineItemId,
          price: createMoney(20),
        };
        Cart.addLineItem(cart, lineItemData);

        expect(JSON.stringify(cart)).toEqual(JSON.stringify(answer));
      });
    });

    describe("When cart doesnt have lineItem", () => {
      it.only("returns the cart with lineItem ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems: Array<Cart.LineItem> = [];
        const lineItemsAnswer = [
          Cart.createLineItem({
            productId: lineItemId,
            unitPrice: createMoney(20),
            quantity: 1,
          }),
        ];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });

        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });
        const lineItemData = {
          productId: lineItemId,
          price: createMoney(20),
        };
        Cart.addLineItem(cart, lineItemData);

        expect(JSON.stringify(cart)).toEqual(JSON.stringify(answer));
      });
    });
  });
  describe("#applyVoucher", () => {
    describe("When cart doesnt have any voucher", () => {
      it("returns the same cart with voucher", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [
          Cart.createLineItem({
            productId: lineItemId,
            unitPrice: createMoney(20),
            quantity: 3,
          }),
        ];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });

        Cart.applyVoucher(cart, appliedVoucher);

        expect(cart).toEqual(answer);
      });
    });
    describe("When cart has voucher", () => {
      it("returns cart with voucher that was applied", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const voucher2 = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESSQ",
          type: "percentual",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({
          productId: lineItemId,
          unitPrice: createMoney(20),
          quantity: 3,
        }),];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const appliedVoucher2 = appliedFactory.fromVoucher(voucher2);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher: appliedVoucher2,
        });

        Cart.applyVoucher(cart, appliedVoucher2);
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

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const error = new Error(
          "Item with productId 3dsa wasn't found in cart!"
        );

        expect(() => Cart.removeLineItem(cart,"3dsa")).toThrow(error);
      });
    });

    describe("When cart has lineItem with quantity different from 0", () => {
      it("returns the quantity minus 1 ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];
        const lineItemsAnswer = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 2})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });

        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });

        Cart.removeLineItem(cart, lineItemId);

        expect(JSON.stringify(cart)).toEqual(JSON.stringify(answer));
      });
    });

    describe("When cart has lineItem with quantity 1", () => {
      it("returns the cart without lineItem ", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 1})];
        const lineItemsAnswer: Array<Cart.LineItem> = [];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });

        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems: lineItemsAnswer,
        });

        Cart.removeLineItem(cart, lineItemId);

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

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });

        Cart.removeVoucher(cart);

        expect(cart).toEqual(answer);
      });
    });
    describe("When cart has voucher", () => {
      it("returns cart without voucher", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const answer = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });

        Cart.removeVoucher(cart);

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

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const discount = Cart.discount(cart);
        const expected = createMoney(0);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has fixed voucher applied", () => {
      it("returns the correct discount", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(5000),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const discount = Cart.discount(cart);
        const expected = createMoney(5000);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has percentual voucher applied", () => {
      it("returns the correct discount", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "percentual",
          amount: createMoney(50),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });

        const discount = Cart.discount(cart);
        const expected = createMoney(3000);

        expect(JSON.stringify(discount)).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has free shipping voucher applied", () => {
      it("returns the correct discount", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "free shipping",
          minValue: createMoney(5000),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });

        const discount = Cart.discount(cart);
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

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(6000);

        expect(JSON.stringify(Cart.subtotal(cart))).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart doesnt have lineItems", () => {
      it("returns 0 in subtotal", () => {
        const voucher = Voucher.createVoucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: createMoney(5000),
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems: Array<Cart.LineItem> = [];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
          appliedVoucher,
        });
        const expected = createMoney(0);

        expect(JSON.stringify(Cart.subtotal(cart))).toEqual(JSON.stringify(expected));
      });
    });
  });
  describe("#shipping", () => {
    describe("When cart has subtotal that is greater than $400.00", () => {
      it("returns $0 for shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(20), quantity: 3})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(0);

        expect(JSON.stringify(Cart.shipping(cart))).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has subtotal that equals $0.00", () => {
      it("returns $0 for shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems: Array<Cart.LineItem> = [];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(0);

        expect(JSON.stringify(Cart.shipping(cart))).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has shipping weight less or equal than 10kg", () => {
      it("returns $30 for shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(2000), quantity: 10})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(3000);

        expect(JSON.stringify(Cart.shipping(cart))).toEqual(JSON.stringify(expected));
      });
    });
    describe("When cart has shipping weight greater than 10kg", () => {
      it("returns the correct shipping", () => {
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(1000), quantity: 20})];

        const cart = Cart.createCart({
          id,
          buyerId,
          lineItems,
        });
        const expected = createMoney(3000 + 2 * 700);

        expect(JSON.stringify(Cart.shipping(cart))).toEqual(JSON.stringify(expected));
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
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "fixed",
            amount: createMoney(5000),
          });

          const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(2000), quantity: 3})];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(4000);

          expect(JSON.stringify(Cart.total(cart))).toEqual(JSON.stringify(expected));
        });
      });
      describe("and has percentual voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "percentual",
            amount: createMoney(50),
          });

          const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(2000), quantity: 3})];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(6000);

          expect(JSON.stringify(Cart.total(cart))).toEqual(JSON.stringify(expected));
        });
      });
      describe("and has free shipping voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "free shipping",
            minValue: createMoney(5000),
          });

          const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(2000), quantity: 3})];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(6000);

          expect(JSON.stringify(Cart.total(cart))).toEqual(JSON.stringify(expected));
        });
      });
      describe("and doesn't have voucher applied", () => {
        it("returns the correct total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems = [Cart.createLineItem({productId: lineItemId, unitPrice: createMoney(2000), quantity: 3})];

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
          });
          const expected = createMoney(9000);

          expect(JSON.stringify(Cart.total(cart))).toEqual(JSON.stringify(expected));
        });
      });
    });
    describe("When cart doesnt have lineItems", () => {
      describe("and has fixed voucher applied", () => {
        it("returns 0 in total", () => {
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "fixed",
            amount: createMoney(5000),
          });

          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<Cart.LineItem> = [];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(Cart.subtotal(cart))).toEqual(
            JSON.stringify(expected)
          );
        });
      });
      describe("and has percentual voucher applied", () => {
        it("returns 0 in total", () => {
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "percentual",
            amount: createMoney(50),
          });

          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<Cart.LineItem> = [];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(Cart.subtotal(cart))).toEqual(
            JSON.stringify(expected)
          );
        });
      });
      describe("and has free shipping voucher applied", () => {
        it("returns 0 in total", () => {
          const voucher = Voucher.createVoucher({
            id: voucherFactory.getNextId(),
            code: "XESBQ",
            type: "free shipping",
            minValue: createMoney(5000),
          });

          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<Cart.LineItem> = [];
          const appliedVoucher = appliedFactory.fromVoucher(voucher);

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
            appliedVoucher,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(Cart.subtotal(cart))).toEqual(
            JSON.stringify(expected)
          );
        });
      });
      describe("and doesn't have voucher applied", () => {
        it("returns 0 in total", () => {
          const id = cartFactory.getNextId();
          const buyerId = cartFactory.getNextId();
          const lineItemId = cartFactory.getNextId();

          const lineItems: Array<Cart.LineItem> = [];

          const cart = Cart.createCart({
            id,
            buyerId,
            lineItems,
          });
          const expected = createMoney(0);

          expect(JSON.stringify(Cart.subtotal(cart))).toEqual(
            JSON.stringify(expected)
          );
        });
      });
    });
  });
});
