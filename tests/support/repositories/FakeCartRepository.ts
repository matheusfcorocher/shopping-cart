import { Cart } from "../../../src/domain/entities";
import { CartRepository } from "../../../src/domain/repositories/CartRepository";

class FakeCartRepository implements CartRepository {
  carts: Array<Cart>;

  constructor(
    carts: Array<Cart>,
  ) {
    this.carts = carts;
  }
  update(cart: Cart): Promise<Cart> {
    return Promise.resolve(cart)
  }
  getCartById(id: number): Promise<Cart> {
    const result = this.carts.filter((cart) => cart.id === id)[0];
    if (result === undefined) {
      const notFoundError = new Error("Not Found Error");
      //   notFoundError.CODE = "NOTFOUND_ERROR";
      notFoundError.message = `Cart with id ${id} can't be found.`;
      return Promise.reject(notFoundError);
    }
    return Promise.resolve(result);
  }
  getAllCarts(): Promise<Cart[]> {
    return Promise.resolve(this.carts);
  }
}

export { FakeCartRepository };
