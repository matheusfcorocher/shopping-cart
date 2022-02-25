import { Cart, Order } from "../entities";
import { OrderData, PaymentMethod } from "../entities/Order";
import { CartRepository } from "../repositories/CartRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { ProductRepository } from "../repositories/ProductRepository";

interface CheckoutDomainServiceProps {
  cartdId: number;
  buyerId: number;
  paymentMethod: PaymentMethod;
}

type ProductsDataProps = {
  productId: number;
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

  private convertCartToOrderData(
    cart: Cart,
    data: CheckoutDomainServiceProps
  ): OrderData {
    const { lineItems, subtotal, shipping, discount, total } = cart;
    const { buyerId, paymentMethod } = data;
    return {
      buyerId,
      cart: {
        lineItems,
        subtotal,
        shipping,
        discount,
        total,
      },
      paymentMethod,
    };
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
      internalError.message = `Product with id ${lineItem.productId} was not found in products data`
      throw internalError;
    });
    const messageErrors = buying.reduce((acc: Array<any>, b) => {
      if(b.canBuy)
        return [...acc]
      else
        return [...acc, b.message]
    }, []);

    if(messageErrors.length === 0) 
      return true
    
    throw new AggregateError(messageErrors.map(m => {
      const badRequestError = new Error("Bad request Error")
      badRequestError.message = m.message
    }));
  }

  public async execute(data: CheckoutDomainServiceProps): Promise<string> {
    const cart = await this.cartRepository.getCartById(data.cartdId);
    const products = await this.productRepository.getAllProducts();
    const productsData = products.map((product) => {
      const { id, name, available } = product;
      return { productId: id, name, available };
    });
    this.verifyAvailability(cart, productsData)
    const orderId = this.orderRepository.getNextId();
    const orderData = this.convertCartToOrderData(cart, data);
    const order = new Order({
      ...orderData,
      id: orderId,
    });
    await this.orderRepository.createOrder(order);
    await this.cartRepository.delete(cart);
    return "Order created successfully!";
  }
}

export {CheckoutDomainServiceProps};
