import { LineItems } from "./Cart";

type PaymentMethod =
  | "pix"
  | "credit card"
  | "debit card"
  | "bill"
  | "crypto wallet";

interface CartProps {
  lineItems: LineItems;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

interface OrderData {
  buyerId: string;
  cart: CartProps;
  paymentMethod: PaymentMethod;
}

interface OrderProps extends OrderData {
  id: string;
}

export default class Order {
  id: string;
  buyerId: string;
  cart: CartProps;
  paymentMethod: PaymentMethod;

  constructor({ id, cart, paymentMethod, buyerId }: OrderProps) {
    this.id = id;
    this.buyerId = buyerId;
    this.cart = cart;
    this.paymentMethod = paymentMethod;
  }
}

export { OrderData, PaymentMethod };
