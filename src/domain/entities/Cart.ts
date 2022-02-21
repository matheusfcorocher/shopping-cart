import { Voucher } from ".";
import { ShippingDomainService } from "../services/ShippingDomainService";

type CartState = "CREATED" | "PENDING" | "FINISHED";
type LineItems = Array<LineItem>;

class LineItem {
  productId: number;
  quantity: number;

  constructor(productId: number, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}
export default class Cart {
  id: number;
  lineItems: LineItems;
  voucherId?: number;
  state: CartState;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  constructor(
    id: number,
    lineItems: LineItems,
    voucherId: number,
    state: CartState
  ) {
    this.id = id;
    this.lineItems = lineItems;
    this.voucherId = voucherId;
    this.state = state;
    this.subtotal = 0;
    this.discount = 0;
    this.shipping = 0;
    this.total = 0;
  }

  public isFinished(): boolean {
    return this.state == "FINISHED";
  }

  public calculateCartWeight(): number {
    return this.lineItems.reduce(
      (acc: number, item: LineItem) => acc + item.quantity,
      0
    );
  }
}

export { CartState, LineItems, LineItem };
