import { LineItems } from "./Cart";

type PaymentMethod =
  | "pix"
  | "credit card"
  | "debit card"
  | "bill"
  | "crypto wallet";

interface OrderData {
  buyerId: string;
  lineItems: LineItems;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
}

interface OrderProps extends OrderData {
  id: string;
}

export default class Order {
  id: string;
  buyerId: string;
  lineItems: LineItems;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;

  constructor({ id,  buyerId, lineItems, subtotal, shipping, discount, total, paymentMethod}: OrderProps) {
    this.id = id;
    this.buyerId = buyerId;
    this.lineItems = lineItems;
    this.subtotal = subtotal;
    this.shipping = shipping;
    this.discount = discount;
    this.total = total;
    this.paymentMethod = paymentMethod;
  }
}

export { OrderData, PaymentMethod };
