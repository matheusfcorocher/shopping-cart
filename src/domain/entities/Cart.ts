import { Voucher } from ".";
import { DiscountDomainService } from "../services/DiscountDomainService";
import { ShippingDomainService } from "../services/ShippingDomainService";

type CartState = "CREATED" | "PENDING" | "FINISHED";
type Products = Array<LineItem>;

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
  products: Products;
  voucherId?: number;
  state: CartState;
  // subtotal: number;
  // shipping: number;
  // discount: number;
  // total: number;


  constructor(
    id: number,
    products: Products,
    voucherId: number,
    state: CartState
  ) {
    this.id = id;
    this.products = products;
    this.voucherId = voucherId;
    this.state = state;
    // this.subtotal = this.calculateSubTotalCost();
    // this.total = this.calculateTotalCost();
  }

  public isFinished(): boolean {
    return this.state == "FINISHED";
  }

  // private calculateSubTotalCost() {
  //   return this.products.reduce((acc, p) => acc+p.price, 0);
  // }

  // private calculateTotalCost() {
  //   return this.subtotal + this.shipping - this.discount;
  // }
}

export {CartState, Products};
