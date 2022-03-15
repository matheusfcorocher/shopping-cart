import { LineItem, LineItems } from "./Cart";

type PaymentMethod =
  | "pix"
  | "credit card"
  | "debit card"
  | "bill"
  | "crypto wallet";

interface OrderData {
  buyerId: string;
  lineItems: LineItems;
  discount: number;
  paymentMethod: PaymentMethod;
}

interface OrderProps extends OrderData {
  id: string;
}

export default class Order {
  id: string;
  buyerId: string;
  lineItems: LineItems;
  discount: number;
  paymentMethod: PaymentMethod;

  constructor({ id,  buyerId, lineItems, discount, paymentMethod}: OrderProps) {
    this.id = id;
    this.buyerId = buyerId;
    this.lineItems = lineItems;
    this.discount = discount;
    this.paymentMethod = paymentMethod;
  }

  public get subtotal(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity * item.unitPrice,
          0
        )
      : 0;
  }

  public get shipping(): number {
    if (this.subtotal > 400) {
      return 0;
    }
    const shippingWeight: number = this.calculateCartWeight();
    if (shippingWeight <= 10) return 30;

    return this.calculateShippingCost(shippingWeight);
  }

  public get total(): number {
    return this.subtotal + this.shipping - this.discount;
  }

  private calculateCartWeight(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity,
          0
        )
      : 0;
  }

  private calculateShippingCost(weight: number): number {
    //If weight is above 10kg, will charge $7 for each
    //5kg that cart has
    return Math.floor((weight - 10) / 5) * 7 + 30;
  }
}

export { OrderData, PaymentMethod };
