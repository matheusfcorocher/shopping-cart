import { Cart, Voucher, Buyer, Product } from "../../../../../src/domain/entities";
import { LineItem } from "../../../../../src/domain/entities/Cart";
import { appliedFactory } from "../../../../../src/domain/factories/AppliedVoucherFactory";
import { FakeBuyerRepository } from "../../../../support/repositories/FakeBuyerRepository";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";
import { FakeVoucherRepository } from "../../../../support/repositories/FakeVoucherRepository";

describe("Domain :: Entity :: Cart", () => {
  describe("#addLineItem", () => {
    describe("When cart has lineItem with quantity different from 0", () => {
      it("returns the quantity plus 1 ", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, 20, 2)];
        const lineItemsAnswer = [new LineItem(lineItemId, 20, 3)];
        
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
          price: 20
        }
        cart.addLineItem(lineItemData)

        expect(cart).toEqual(answer)
      });
    });

    describe("When cart doesnt have lineItem", () => {
      it("returns the cart with lineItem ", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems : Array<LineItem> = [];
        const lineItemsAnswer = [new LineItem(lineItemId, 20, 1)];
        
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
          price: 20
        }
        cart.addLineItem(lineItemData)

        expect(cart).toEqual(answer)
      });
    });
  });
  describe("#applyVoucher", () => {
    describe("When cart doesnt have any voucher", () => {
      it("returns the same cart with voucher", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        const vouchers: Array<Voucher> = [];
        const voucherFactory = new FakeVoucherRepository(vouchers);
        
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: 50,
        });

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, 20, 3)];
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
          appliedVoucher
        });

        cart.applyVoucher(appliedVoucher);

        expect(cart).toEqual(answer);
      });
    });
    describe("When cart has voucher", () => {
      it("returns cart with voucher that was applied", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        const vouchers: Array<Voucher> = [];
        const voucherFactory = new FakeVoucherRepository(vouchers);
        
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: 50,
        });

        const voucher2 = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESSQ",
          type: "percentual",
          amount: 50,
        });

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();
        
        const lineItems = [new LineItem(lineItemId, 20, 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        const appliedVoucher2 = appliedFactory.fromVoucher(voucher2);
        
        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher
        });
        const answer = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher : appliedVoucher2
        });

        cart.applyVoucher(appliedVoucher2);
        expect(cart).toEqual(answer);
      });
    });
  });
  describe("#removeLineItem", () => {
    describe("When productId is not found in cart", () => {
      it("returns not found error", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, 20, 3)];
        
        const cart = new Cart({
          id,
          buyerId,
          lineItems,
        });
        const error = new Error("Item wasn't found in cart!")

        expect(() => cart.removeLineItem('3dsa')).toThrow(error)
      });
    });

    describe("When cart has lineItem with quantity different from 0", () => {
      it("returns the quantity minus 1 ", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, 20, 3)];
        const lineItemsAnswer = [new LineItem(lineItemId, 20, 2)];
        
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

        cart.removeLineItem(lineItemId)

        expect(cart).toEqual(answer)
      });
    });

    describe("When cart has lineItem with quantity 1", () => {
      it("returns the cart without lineItem ", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, 20, 1)];
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

        cart.removeLineItem(lineItemId)

        expect(cart).toEqual(answer)
      });
    });
  });
  describe("#removeVoucher", () => {
    describe("When cart doesnt have any voucher", () => {
      it("returns the same cart", () => {
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();

        const lineItems = [new LineItem(lineItemId, 20, 3)];

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
        const carts: Array<Cart> = [];
        const cartFactory = new FakeCartRepository(carts);

        const buyers: Array<Buyer> = [];
        const buyerFactory = new FakeBuyerRepository(buyers);

        const products: Array<Product> = [];
        const productFactory = new FakeProductRepository(products);

        const vouchers: Array<Voucher> = [];
        const voucherFactory = new FakeVoucherRepository(vouchers);
        
        const voucher = new Voucher({
          id: voucherFactory.getNextId(),
          code: "XESBQ",
          type: "fixed",
          amount: 50,
        });

        
        const id = cartFactory.getNextId();
        const buyerId = cartFactory.getNextId();
        const lineItemId = cartFactory.getNextId();
        
        const lineItems = [new LineItem(lineItemId, 20, 3)];
        const appliedVoucher = appliedFactory.fromVoucher(voucher);
        
        const cart = new Cart({
          id,
          buyerId,
          lineItems,
          appliedVoucher
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
});
