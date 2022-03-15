import { AppliedVoucher } from "../valueObjects/AppliedVoucher";

type LineItems = Array<LineItem>;
class LineItem {
  productId: string;
  unitPrice: number;
  quantity: number;

  constructor(productId: string, unitPrice: number, quantity: number) {
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
  price: number;
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

  public get discount(): number {
    return this.appliedVoucher
      ? this.appliedVoucher.apply(this.shipping, this.subtotal)
      : 0;
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

  private calculateShippingCost(weight: number): number {
    //If weight is above 10kg, will charge $7 for each
    //5kg that cart has
    return Math.floor((weight - 10) / 5) * 7 + 30;
  }

 
}

export { LineItems, LineItem };
