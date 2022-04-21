import * as Cart from "../../../../../src/domain/entities/Cart";
import * as Product from "../../../../../src/domain/entities/Product";
import * as Order from "../../../../../src/domain/entities/Order";
import * as CheckoutService from "../../../../../src/domain/services/CheckoutDomainService";
import { createMoney } from "../../../../../src/domain/valueObjects/Money";
import {
  DomainError,
} from "../../../../../src/lib/errors/DomainError";
import {
  DomainAggregateError,
} from "../../../../../src/lib/errors/DomainAggregateError";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeOrderRepository } from "../../../../support/repositories/FakeOrderRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Domain :: Services :: CheckoutDomainServices", () => {
  describe("#execute", () => {
    describe("when cartId doesn't exist", () => {
      it("returns not found error", async () => {
        const lineItems: Cart.LineItems = [];

        const cart = Cart.createCart({
          id: "aad",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id asd can't be found.`;

        const data: CheckoutService.DataProps = {
          cartId: "asd",
          buyerId: "aad",
          paymentMethod: "pix",
        };

        await expect(() => checkout(data)).rejects.toThrow(notFoundError);
      });
    });
    describe("when query in products and service is unavailable", () => {
      it("returns error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "aad",
            unitPrice: createMoney(20),
            quantity: 2,
          }),
        ];
        const cart = Cart.createCart({
          id: "aad",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        productRepository.getAllProducts = () => {
          throw error;
        };

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "aad",
          buyerId: "aad",
          paymentMethod: "pix",
        };

        await expect(() => checkout(data)).rejects.toThrow(error);
      });
    });
    describe("when a line item is not found in products data", () => {
      it("returns internal error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(20),
            quantity: 2,
          }),
          Cart.createLineItem({
            productId: "abd",
            unitPrice: createMoney(40),
            quantity: 1,
          }),
        ];
        const cart = Cart.createCart({
          id: "adds",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abe",
            name: "Chocolate",
            price: createMoney(20),
            available: 0,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const internalError = new Error("Internal Error");
        internalError.message = `Product with id abc was not found in products data`;

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "adds",
          buyerId: "adds",
          paymentMethod: "pix",
        };

        await expect(() => checkout(data)).rejects.toThrow(internalError);
      });
    });
    describe("when request a line item but it's out of stock", () => {
      it("returns bad request error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(20),
            quantity: 2,
          }),
        ];
        const cart = Cart.createCart({
          id: "cbc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(20),
            available: 0,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const badRequestError = DomainError.create({
          name: "Bad request Error",
          code: "BADREQUEST_ERROR",
          message: `Product Chocolate is out of stock`,
        });
        const errors = [badRequestError];
        const aggregateError = DomainAggregateError.create({
          name: "Bad Request Error",
          code: "BADREQUEST_ERROR",
          errors,
          message:
            "Was found multiple validation errors in the request. See property errors for details.",
        });

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "cbc",
          buyerId: "cbc",
          paymentMethod: "pix",
        };
        await expect(() => checkout(data)).rejects.toThrow(aggregateError);
      });
    });
    describe("when request a line item but its quantity surpass the quantity available of that product", () => {
      it("returns bad request error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(20),
            quantity: 4,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(20),
            available: 3,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const badRequestError = DomainError.create({
          name: "Bad request Error",
          code: "BADREQUEST_ERROR",
          message: `Can't buy the product Chocolate with quantity 4 due it's only available 3 units`,
        });
        const errors = [badRequestError];
        const aggregateError = DomainAggregateError.create({
          name: "Bad Request Error",
          code: "BADREQUEST_ERROR",
          errors,
          message:
            "Was found multiple validation errors in the request. See property errors for details.",
        });

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await expect(() => checkout(data)).rejects.toThrow(aggregateError);
      });
    });

    describe("when try to create order but its fail", () => {
      it("returns internal error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(20),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(20),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        orderRepository.store = () => {
          throw error;
        };

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await expect(() => checkout(data)).rejects.toThrow(error);
      });
    });
    describe("when try to update products but its fail", () => {
      it("returns internal error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(20),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(20),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        productRepository.update = () => {
          throw error;
        };

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await expect(() => checkout(data)).rejects.toThrow(error);
      });
    });
    describe("when try to delete cart but its fail", () => {
      it("returns internal error", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(20),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(20),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        cartRepository.delete = () => {
          throw error;
        };

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await expect(() => checkout(data)).rejects.toThrow(error);
      });
    });
    describe("when try to checkout cart but doesnt have any line items", () => {
      it("returns validation error", async () => {
        const lineItems: Cart.LineItems = [];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(20),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const validationError = new Error("Validation Error");
        validationError.message =
          "cart must have line items to become a order.";

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await expect(() => checkout(data)).rejects.toThrow(validationError);
      });
    });

    describe("when create order", () => {
      it("create order", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(2000),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(2000),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await checkout(data);
        expect(orders.length).toBe(1);
      });
      it("reduce stock", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(2000),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(2000),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await checkout(data);
        expect(products.length).toBe(1);
        expect(JSON.stringify(products[0])).toEqual(
          JSON.stringify(
            Product.createProduct({
              id: "abc",
              name: "Chocolate",
              price: createMoney(2000),
              available: 2,
            })
          )
        );
      });
      it("delete cart", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(2000),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(2000),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        await checkout(data);
        expect(carts.length).toBe(0);
      });
      it("returns the right message", async () => {
        const lineItems: Cart.LineItems = [
          Cart.createLineItem({
            productId: "abc",
            unitPrice: createMoney(2000),
            quantity: 3,
          }),
        ];
        const cart = Cart.createCart({
          id: "abc",
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product.Product> = [
          Product.createProduct({
            id: "abc",
            name: "Chocolate",
            price: createMoney(2000),
            available: 5,
          }),
        ];
        const orders: Array<Order.Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = CheckoutService.makeCheckout({
          cartRepository,
          productRepository,
          orderRepository,
        });

        const data: CheckoutService.DataProps = {
          cartId: "abc",
          buyerId: "abc",
          paymentMethod: "pix",
        };
        expect(await checkout(data)).toEqual("Order created successfully!");
      });
    });
  });
});
