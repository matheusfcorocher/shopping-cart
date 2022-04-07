import { AppliedVoucher } from "../valueObjects/AppliedVoucher";
import { createMoney, Money } from "../valueObjects/Money";

type LineItems = Array<LineItem>;
class LineItem {
  productId: string;
  unitPrice: Money;
  quantity: number;

  constructor(productId: string, unitPrice: Money, quantity: number) {
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }
}

type CartProps = {
  id: string;
  buyerId?: string;
  lineItems: LineItems;
  appliedVoucher?: AppliedVoucher;
};

type LineItemDataProps = {
  productId: string;
  price: Money;
};
export default class Cart {
  id: string;
  buyerId?: string;
  lineItems: LineItems;
  appliedVoucher?: AppliedVoucher;

  constructor({ id, buyerId, lineItems, appliedVoucher}: CartProps) {
    this.id = id;
    this.buyerId = buyerId;
    this.lineItems = lineItems;
    this.appliedVoucher = appliedVoucher;
  }

  public get discount(): Money {
    return this.appliedVoucher
      ? this.appliedVoucher.apply(this.shipping, this.subtotal)
      : createMoney(0);
  }

  public get subtotal(): Money {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: Money, item: LineItem) => acc.add(item.unitPrice.multiply(item.quantity)),
          createMoney(0)
        )
      :createMoney(0);
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

  public addLineItem(lineItemData : LineItemDataProps) : void {
    const item = this.lineItems.find(item => item.productId.normalize() === lineItemData.productId.normalize())
    if(item) {
      item.quantity += 1;
      const index = this.lineItems.findIndex(lineItem => lineItem.productId.normalize() === lineItemData.productId.normalize())
      this.lineItems[index] = item;
    } else {
      const newLineItem = new LineItem(lineItemData.productId, lineItemData.price, 1)
      this.lineItems = [...this.lineItems, newLineItem];
    }
  }

  public applyVoucher(appliedVoucher: AppliedVoucher) : void {
    this.appliedVoucher = appliedVoucher;
  }

  public removeLineItem(productId: string) : void {
    const item = this.lineItems.find(item => item.productId.normalize() === productId.normalize())
    if(item) {
      item.quantity -= 1;
      const index = this.lineItems.findIndex(lineItem => lineItem.productId.normalize() === productId.normalize())
      if(item.quantity <= 0)
        this.lineItems.splice(index, 1)
      else
        this.lineItems[index] = item;
    } else {
      throw new Error(`Item with productId ${productId} wasn't found in cart!`)
    }
  }

  public removeVoucher() : void {
    this.appliedVoucher = undefined;
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

export { LineItems, LineItem, CartProps };
