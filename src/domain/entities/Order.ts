import { createMoney, Money } from "../valueObjects/Money";
import { LineItem, LineItems } from "./Cart";

type PaymentMethod =
  | "pix"
  | "credit card"
  | "debit card"
  | "bill"
  | "crypto wallet";

interface OrderData {
  id: string;
  buyerId: string;
  lineItems: LineItems;
  discount: Money;
  paymentMethod: PaymentMethod;
}

type Order = {
  id: string;
  buyerId: string;
  lineItems: LineItems;
  discount: Money;
  paymentMethod: PaymentMethod;
}

function subtotal(order: Order): Money {
  return order.lineItems
    ? order.lineItems.reduce(
        (acc: Money, item: LineItem) =>
          acc.add(item.unitPrice.multiply(item.quantity)),
        createMoney(0)
      )
    : createMoney(0);
}

function shipping(order: Order): Money {
  if (subtotal(order).greaterThanOrEqual(createMoney(40000))) {
    return createMoney(0);
  }
  const shippingWeight: number = calculateCartWeight(order);
  if (shippingWeight <= 10) return createMoney(3000);

  return calculateShippingCost(shippingWeight);
}

function total(order: Order): Money {
  return subtotal(order).add(shipping(order)).subtract(order.discount);
}

function calculateCartWeight(order: Order): number {
  return order.lineItems
    ? order.lineItems.reduce(
        (acc: number, item: LineItem) => acc + item.quantity,
        0
      )
    : 0;
}

function calculateShippingCost(weight: number): Money {
  //If weight is above 10kg, will charge $7 for each
  //5kg that cart has
  return ((createMoney(weight).subtract(createMoney(10))).divide(5)).multiply(700).add(createMoney(3000));
}




export { OrderData, PaymentMethod, subtotal, total, shipping};
