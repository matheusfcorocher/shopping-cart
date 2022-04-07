import { createMoney, Money } from "../valueObjects/Money";
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
  discount: Money;
  paymentMethod: PaymentMethod;
}

interface OrderProps extends OrderData {
  id: string;
}

export default class Order {
  id: string;
  buyerId: string;
  lineItems: LineItems;
  discount: Money;
  paymentMethod: PaymentMethod;

  constructor({ id, buyerId, lineItems, discount, paymentMethod }: OrderProps) {
    this.id = id;
    this.buyerId = buyerId;
    this.lineItems = lineItems;
    this.discount = discount;
    this.paymentMethod = paymentMethod;
  }

  public get subtotal(): Money {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: Money, item: LineItem) =>
            acc.add(item.unitPrice.multiply(item.quantity)),
          createMoney(0)
        )
      : createMoney(0);
  }

  public get shipping(): Money {
    if (this.subtotal.greaterThanOrEqual(createMoney(40000))) {
      return createMoney(0);
    }
    const shippingWeight: number = this.calculateCartWeight();
    if (shippingWeight <= 10) return createMoney(3000);

    return this.calculateShippingCost(shippingWeight);
  }

  public get total(): Money {
    return this.subtotal.add(this.shipping).subtract(this.discount);
  }

  private calculateCartWeight(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity,
          0
        )
      : 0;
  }

  private calculateShippingCost(weight: number): Money {
    //If weight is above 10kg, will charge $7 for each
    //5kg that cart has
    return ((createMoney(weight).subtract(createMoney(10))).divide(5)).multiply(700).add(createMoney(3000));
  }
}

export { OrderData, PaymentMethod };
