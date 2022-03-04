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
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  constructor({ id, buyerId, lineItems, appliedVoucher}: CartProps) {
    this.id = id;
    this.buyerId = buyerId;
    this.lineItems = lineItems;
    this.appliedVoucher = appliedVoucher;
    this.subtotal = this.calculateSubTotalCost();
    this.shipping = this.calculateShipping();
    this.discount = this.calculateDiscount();
    this.total = this.calculateTotal();
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

    this.recalculateValues();
  }

  public applyVoucher(appliedVoucher: AppliedVoucher) : void {
    this.appliedVoucher = appliedVoucher;

    this.recalculateValues();
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
      this.recalculateValues();
    } else {
      throw new Error(`Item with productId ${productId} wasn't found in cart!`)
    }
  }

  public removeVoucher() : void {
    this.appliedVoucher = undefined;

    this.recalculateValues();
  }

  private calculateCartWeight(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity,
          0
        )
      : 0;
  }

  private calculateDiscount(): number {
    return this.appliedVoucher
      ? this.appliedVoucher.apply(this.shipping, this.subtotal)
      : 0;
  }

  private calculateSubTotalCost(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity * item.unitPrice,
          0
        )
      : 0;
  }

  private calculateShipping(): number {
    if (this.subtotal > 400) {
      return 0;
    }
    const shippingWeight: number = this.calculateCartWeight();
    if (shippingWeight <= 10) return 30;

    return this.calculateShippingCost(shippingWeight);
  }

  private calculateShippingCost(weight: number): number {
    //If weight is above 10kg, will charge $7 for each
    //5kg that cart has
    return Math.floor((weight - 10) / 5) * 7 + 30;
  }

  private calculateTotal(): number {
    return this.subtotal + this.shipping - this.discount;
  }

  private recalculateValues() : void {
    this.subtotal = this.calculateSubTotalCost();
    this.shipping = this.calculateShipping();
    this.discount = this.calculateDiscount();
    this.total = this.calculateTotal();
  }
}

export { LineItems, LineItem };
