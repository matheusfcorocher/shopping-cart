import Product from "./Product";

type cartState = "CREATED" | "PENDING" | "FINISHED";
type products = Array<Product>;

export default class Cart {
  id: number;
  products: products;
  voucher?: number;
  state: cartState;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;


  constructor(
    id: number,
    products: products,
    voucher: number,
    state: cartState
  ) {
    this.id = id;
    this.products = products;
    this.voucher = voucher;
    this.state = state;
    this.subtotal = this.calculateSubTotalCost();
    this.shipping = 3;
    this.discount = 1;
    this.total = this.calculateTotalCost();
  }

  public isFinished(): boolean {
    return this.state == "FINISHED";
  }

  private calculateSubTotalCost() {
    return this.products.reduce((acc, p) => acc+p.price, 0);
  }

  private calculateTotalCost() {
    return this.subtotal - (this.shipping + this.discount);
  }
}

export {cartState, products};
