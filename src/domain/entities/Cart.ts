import { AppliedVoucher } from "../valueObjects/AppliedVoucher";

type CartState = "CREATED" | "PENDING" | "FINISHED";
type LineItems = Array<LineItem>;
class LineItem {
  productId: number;
  unitPrice: number;
  quantity: number;

  constructor(productId: number, unitPrice: number, quantity: number) {
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }
}

type CartProps = {
  id: number;
  lineItems: LineItems;
  appliedVoucher?: AppliedVoucher;
  state: CartState;
};

type LineItemDataProps = {
  productId: number;
  price: number;
};
export default class Cart {
  id: number;
  lineItems: LineItems;
  appliedVoucher?: AppliedVoucher;
  state: CartState;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  constructor({ id, lineItems, appliedVoucher, state }: CartProps) {
    this.id = id;
    this.lineItems = lineItems;
    this.appliedVoucher = appliedVoucher;
    this.state = state;
    this.subtotal = this.calculateSubTotalCost();
    this.shipping = this.calculateShipping();
    this.discount = this.calculateDiscount();
    this.total = this.calculateTotal();
  }

  public addLineItem(lineItemData : LineItemDataProps) : void {
    const item = this.lineItems.find(item => item.productId === lineItemData.productId)
    if(item) {
      item.quantity += 1;
      const index = this.lineItems.findIndex(lineItem => lineItem.productId === lineItemData.productId)
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

  public calculateCartWeight(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity,
          0
        )
      : 0;
  }

  public calculateDiscount(): number {
    return this.appliedVoucher
      ? this.appliedVoucher.apply(this.shipping, this.subtotal)
      : 0;
  }

  public calculateSubTotalCost(): number {
    return this.lineItems
      ? this.lineItems.reduce(
          (acc: number, item: LineItem) => acc + item.quantity * item.unitPrice,
          0
        )
      : 0;
  }

  public calculateShipping(): number {
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

  public calculateTotal(): number {
    return this.subtotal + this.shipping - this.discount;
  }

  public isFinished(): boolean {
    return this.state == "FINISHED";
  }

  private recalculateValues() : void {
    this.subtotal = this.calculateSubTotalCost();
    this.shipping = this.calculateShipping();
    this.discount = this.calculateDiscount();
    this.total = this.calculateTotal();
  }

  public removeLineItem(productId: number) : void {
    const item = this.lineItems.find(item => item.productId === productId)
    if(item) {
      item.quantity -= 1;
      const index = this.lineItems.findIndex(lineItem => lineItem.productId === productId)
      if(item.quantity <= 0)
        this.lineItems.splice(index, 1)
      else
        this.lineItems[index] = item;
      this.recalculateValues();
    } else {
      throw new Error("Item wasn't found in cart!")
    }
  }

  public removeVoucher() : void {
    this.appliedVoucher = undefined;

    this.recalculateValues();
  }
}

export { CartState, LineItems, LineItem };
