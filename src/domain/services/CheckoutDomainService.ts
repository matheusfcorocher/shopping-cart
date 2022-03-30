import { Cart, Order, Product } from "../entities";
import { OrderData, PaymentMethod } from "../entities/Order";
import { CartRepository } from "../repositories/CartRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { ProductRepository } from "../repositories/ProductRepository";

interface CheckoutDomainServiceProps {
  cartdId: string;
  buyerId: string;
  paymentMethod: PaymentMethod;
}

type ProductsDataProps = {
  productId: string;
  name: string;
  available: number;
};

export default class CheckoutDomainService {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
  orderRepository: OrderRepository;

  constructor(
    cartRepository: CartRepository,
    productRepository: ProductRepository,
    orderRepository: OrderRepository
  ) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
  }

  public async execute(data: CheckoutDomainServiceProps): Promise<string> {
    const cart = await this.cartRepository.getCartById(data.cartdId);
    const validationError = new Error('Validation Error');
    validationError.message = "cart must have line items to become a order."
    if(cart.lineItems.length == 0)throw validationError;
    const products = await this.productRepository.getAllProducts();
    const productsData = products.map((product) => {
      const { id, name, available } = product;
      return { productId: id, name, available };
    });
    this.verifyAvailability(cart, productsData);
    const orderId = this.orderRepository.getNextId();
    const orderData = this.convertCartToOrderData(cart, data);
    const order = new Order({
      ...orderData,
      id: orderId,
    });
    await this.orderRepository.store(order);
    await this.stockReduction(cart, products);
    await this.cartRepository.delete(cart);
    return "Order created successfully!";
  }

  private convertCartToOrderData(
    cart: Cart,
    data: CheckoutDomainServiceProps
  ): OrderData {
    const { lineItems, discount } = cart;
    const { buyerId, paymentMethod } = data;
    return {
      buyerId,
      lineItems,
      discount,
      paymentMethod,
    };
  }

  private async stockReduction(
    cart: Cart,
    products: Array<Product>
  ): Promise<String> {
    const updatedProducts = this.updateProducts(cart, products);

    const promises = [];
    for (let product of updatedProducts) {
      const { id, available } = product;
      promises.push(this.productRepository.update(id, { available }));
    }
    await Promise.all(promises);

    return Promise.resolve("Products stock were updated successfully!");
  }

  private updateProducts(cart: Cart, products: Array<Product>): Array<Product> {
    const updatedProducts = products.map((product) => {
      const lineItem = cart.lineItems.find(
        (lineItem) => product.id == lineItem.productId
      );
      if (lineItem) {
        product.available = product.available - lineItem.quantity;
      }

      return product;
    });
    return updatedProducts;
  }

  private verifyAvailability(
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

      const internalError = new Error("Internal Error");
      internalError.message = `Product with id ${lineItem.productId} was not found in products data`;
      throw internalError;
    });
    const messageErrors = buying.reduce((acc: Array<any>, b) => {
      if (b.canBuy) return [...acc];
      else return [...acc, b.message];
    }, []);

    if (messageErrors.length === 0) return true;

    const errors = messageErrors.map((m) => {
      const badRequestError = new Error("Bad request Error");
      badRequestError.message = m;
      return badRequestError;
    });
    const aggregateError = new AggregateError(errors);

    throw aggregateError;
  }
}

export { CheckoutDomainServiceProps };
