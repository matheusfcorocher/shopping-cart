import { Product, Cart, Order } from "../../../../../src/domain/entities";
import { LineItem, LineItems } from "../../../../../src/domain/entities/Cart";
import CheckoutDomainService, {
  CheckoutDomainServiceProps,
} from "../../../../../src/domain/services/CheckoutDomainService";
import { FakeCartRepository } from "../../../../support/repositories/FakeCartRepository";
import { FakeOrderRepository } from "../../../../support/repositories/FakeOrderRepository";
import { FakeProductRepository } from "../../../../support/repositories/FakeProductRepository";

describe("Domain :: Services :: CheckoutDomainServices", () => {
  describe("#execute", () => {
    describe("when cartId doesn't exist", () => {
      it("returns not found error", async () => {
        const lineItems: LineItems = [];
        
        const cart = new Cart({
          id: 'aad',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const notFoundError = new Error("Not Found Error");
        notFoundError.message = `Cart with id asd can't be found.`;

        const data: CheckoutDomainServiceProps = {
          cartdId: 'asd',
          buyerId: 'aad',
          paymentMethod: "pix",
        };

        await expect(() => checkout.execute(data)).rejects.toThrow(
          notFoundError
        );
      });
    });
    describe("when query in products and service is unavailable", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [new LineItem('aad', 20, 2),];
        const cart = new Cart({
          id: 'aad',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        productRepository.getAllProducts = () => {
          throw error;
        };

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'aad',
          buyerId: 'aad',
          paymentMethod: "pix",
        };

        await expect(() => checkout.execute(data)).rejects.toThrow(error);
      });
    });
    describe("when a line item is not found in products data", () => {
      it("returns internal error", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 2),
          new LineItem('abd', 40, 1),
        ];
        const cart = new Cart({
          id: 'adds',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abe',
            name: "Chocolate",
            price: 20,
            available: 0,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const internalError = new Error("Internal Error");
        internalError.message = `Product with id abc was not found in products data`

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'adds',
          buyerId: 'adds',
          paymentMethod: "pix",
        };

        await expect(() => checkout.execute(data)).rejects.toThrow(internalError);
      });
    });
    describe("when request a line item but it's out of stock", () => {
      it("returns bad request error", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 2),
        ];
        const cart = new Cart({
          id: 'cbc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 0,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const badRequestError = new Error("Bad request Error")
        badRequestError.message = `Product Chocolate is out of stock`
        const errors = [badRequestError];
        const aggregateError = new AggregateError(errors)
        
      
        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'cbc',
          buyerId: 'cbc',
          paymentMethod: "pix",
        };
        await expect(() => checkout.execute(data)).rejects.toThrow(aggregateError);
      });
    });
    describe("when request a line item but its quantity surpass the quantity available of that product", () => {
      it("returns bad request error", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 4),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 3,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const badRequestError = new Error("Bad request Error")
        badRequestError.message = `Can't buy the product Chocolate with quantity 4 due it's only available 3 units`
        const errors = [badRequestError];
        const aggregateError = new AggregateError(errors)
        
      
        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await expect(() => checkout.execute(data)).rejects.toThrow(aggregateError);
      });
    });

    describe("when try to create order but its fail", () => {
      it("returns internal error", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        orderRepository.store = () => {
          throw error;
        };
    
        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await expect(() => checkout.execute(data)).rejects.toThrow(error);
      });
    });
    describe("when try to update products but its fail", () => {
      it("returns internal error", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        productRepository.update = () => {
          throw error;
        };
    
        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await expect(() => checkout.execute(data)).rejects.toThrow(error);
      });
    });
    describe("when try to delete cart but its fail", () => {
      it("returns internal error", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const error = new Error("Service Unavailable");
        cartRepository.delete = () => {
          throw error;
        };
    
        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await expect(() => checkout.execute(data)).rejects.toThrow(error);
      });
    });
    describe("when try to checkout cart but doesnt have any line items", () => {
      it("returns validation error", async () => {
        const lineItems: LineItems = [];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const validationError = new Error('Validation Error');
        validationError.message = "cart must have line items to become a order."
    
        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await expect(() => checkout.execute(data)).rejects.toThrow(validationError);
      });
    });

    describe("when create order", () => {
      it("create order", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await checkout.execute(data);
        expect(orders.length).toBe(1);
      });
      it("reduce stock", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await checkout.execute(data);
        expect(products.length).toBe(1);
        expect(products[0]).toEqual(new Product({
          id: 'abc',
          name: "Chocolate",
          price: 20,
          available: 2,
        }),);
      });
      it("delete cart", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        await checkout.execute(data);
        expect(carts.length).toBe(0);
      });
      it("returns the right message", async () => {
        const lineItems: LineItems = [
          new LineItem('abc', 20, 3),
        ];
        const cart = new Cart({
          id: 'abc',
          lineItems,
        });
        const carts = [cart];

        const products: Array<Product> = [
          new Product({
            id: 'abc',
            name: "Chocolate",
            price: 20,
            available: 5,
          }),
        ];
        const orders: Array<Order> = [];

        const cartRepository = new FakeCartRepository(carts);
        const productRepository = new FakeProductRepository(products);
        const orderRepository = new FakeOrderRepository(orders);

        const checkout = new CheckoutDomainService(
          cartRepository,
          productRepository,
          orderRepository
        );

        const data: CheckoutDomainServiceProps = {
          cartdId: 'abc',
          buyerId: 'abc',
          paymentMethod: "pix",
        };
        expect(await checkout.execute(data)).toEqual("Order created successfully!");
      });
    });
  });
});
