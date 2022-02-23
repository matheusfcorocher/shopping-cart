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

  public addLineItem(lineItem: LineItem) : void {
    const item = this.lineItems.find(item => item.productId === lineItem.productId && item.unitPrice
      === lineItem.unitPrice)
    if(item) {
      item.quantity += lineItem.quantity;
      const index = this.lineItems.findIndex(LineItem => LineItem.productId === item.productId && LineItem.unitPrice === item.unitPrice)
      this.lineItems[index] = item;
    } else {
      this.lineItems = [...this.lineItems, lineItem];
    }

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

}

export { CartState, LineItems, LineItem };
