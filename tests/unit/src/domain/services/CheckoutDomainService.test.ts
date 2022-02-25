import { Product, Cart, Order } from "../../../../../src/domain/entities";
import { LineItems } from "../../../../../src/domain/entities/Cart";
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
          id: 1,
          lineItems,
          state: "CREATED",
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
        notFoundError.message = `Cart with id 2 can't be found.`;

        const data: CheckoutDomainServiceProps = {
          cartdId: 2,
          buyerId: 1,
          paymentMethod: "pix",
        };

        await expect(() => checkout.execute(data)).rejects.toThrow(
          notFoundError
        );
      });
    });
    describe("when query in products and service is unavailable", () => {
      it("returns error", async () => {
        const lineItems: LineItems = [];
        const cart = new Cart({
          id: 1,
          lineItems,
          state: "CREATED",
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
          cartdId: 1,
          buyerId: 1,
          paymentMethod: "pix",
        };

        await expect(() => checkout.execute(data)).rejects.toThrow(error);
      });
    });
  });
});
