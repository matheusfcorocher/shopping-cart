import Product from "./Product";

type cartState = "CREATED" | "PENDING" | "FINISHED";
type products = Array<Product>;

export default class Cart {
  id: number;
  products: products;
  voucher: number;
  state: cartState;

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
  }

  public isFinished(): boolean {
    return this.state == "FINISHED";
  }
}

export {cartState, products};
