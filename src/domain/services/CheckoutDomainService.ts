import { DomainError } from "../../lib/errors/DomainError";
import { DomainAggregateError } from "../../lib/errors/DomainAggregateError";
import { Cart, discount } from "../entities/Cart";
import { createOrder, OrderData, PaymentMethod } from "../entities/Order";
import { createProduct, Product } from "../entities/Product";
import { CartRepository } from "../repositories/CartRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { ProductRepository } from "../repositories/ProductRepository";

type DataProps = {
  cartId: string;
  buyerId: string;
  paymentMethod: PaymentMethod;
};

type ProductsDataProps = {
  productId: string;
  name: string;
  available: number;
};

type CheckoutDomainServiceProps = {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
  orderRepository: OrderRepository;
};

//public functions

function makeCheckout({
  cartRepository,
  productRepository,
  orderRepository,
}: CheckoutDomainServiceProps) {
  async function checkout(data: DataProps): Promise<string> {
    const cart = await cartRepository.getCartById(data.cartId);
    if (cart.lineItems.length == 0) {
      const validationError = DomainError.create({
        name: "Validation Error",
        code: "VALIDATION_ERROR",
        message: "cart must have line items to become a order.",
      });
      throw validationError;
    }
    const products = await productRepository.getAllProducts();
    const productsData = products.map((product) => {
      const { id, name, available } = product;
      return { productId: id, name, available };
    });
    verifyAvailability(cart, productsData);
    const orderId = orderRepository.getNextId();
    const orderData = convertCartToOrderData(cart, data);
    const order = createOrder({
      ...orderData,
      id: orderId,
    });
    await orderRepository.store(order);
    await stockReduction(cart, products, productRepository);
    await cartRepository.delete(cart);
    return "Order created successfully!";
  }
  return checkout;
}

//private functions

function convertCartToOrderData(cart: Cart, data: DataProps): OrderData {
  const { lineItems } = cart;
  const { buyerId, paymentMethod } = data;
  return {
    buyerId,
    lineItems,
    discount: discount(cart),
    paymentMethod,
  };
}

async function stockReduction(
  cart: Cart,
  products: Array<Product>,
  productRepository: ProductRepository
): Promise<String> {
  const updatedProducts = updateProducts(cart, products);

  const promises = [];
  for (let product of updatedProducts) {
    const { id, available } = product;
    promises.push(productRepository.update(id, { available }));
  }
  await Promise.all(promises);

  return Promise.resolve("Products stock were updated successfully!");
}

function updateProducts(cart: Cart, products: Array<Product>): Array<Product> {
  const updatedProducts = products.map((product) => {
    const lineItem = cart.lineItems.find(
      (lineItem) => product.id == lineItem.productId
    );
    if (lineItem) {
      return {
        ...product,
        available: product.available - lineItem.quantity,
      };
    }

    return product;
  });
  return updatedProducts;
}

function verifyAvailability(
  cart: Cart,
  productsData: Array<ProductsDataProps>
): boolean {
  const buying = cart.lineItems.map((lineItem) => {
    const product = productsData.find(
      (productData) => productData.productId == lineItem.productId
    );
    if (product) {
      if (lineItem.quantity > product.available)
        return {
          canBuy: false,
          message:
            product.available == 0
              ? `Product ${product.name} is out of stock`
              : `Can't buy the product ${product.name} with quantity ${lineItem.quantity} due it's only available ${product.available} units`,
        };
      return {
        canBuy: true,
      };
    }

    const internalError = DomainError.create({
      name: "Not found error",
      code: "NOTFOUND_ERROR",
      message: `Product with id ${lineItem.productId} was not found in products data`,
    });
    throw internalError;
  });
  const messageErrors = buying.reduce((acc: Array<any>, b) => {
    if (b.canBuy) return [...acc];
    else return [...acc, b.message];
  }, []);

  if (messageErrors.length === 0) return true;

  const errors = messageErrors.map((m) => {
    const badRequestError = DomainError.create({
      name: "Validation Error",
      code: "VALIDATION_ERROR",
      message: m,
    });

    return badRequestError;
  });
  const aggregateError = DomainAggregateError.create({
    name: "Validation Error",
    code: "VALIDATION_ERROR",
    errors,
    message:
      "Was found multiple validation errors in the request. See property errors for details.",
  });

  throw aggregateError;
}

export { DataProps };

export { makeCheckout };
