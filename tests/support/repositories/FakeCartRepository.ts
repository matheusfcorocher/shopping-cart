import { v4 as uuidv4 } from 'uuid';
import { Cart } from "../../../src/domain/entities";
import { LineItem } from '../../../src/domain/entities/Cart';
import { CartRepository } from "../../../src/domain/repositories/CartRepository";

class FakeCartRepository implements CartRepository {
  carts: Array<Cart>;

  constructor(
    carts: Array<Cart>,
  ) {
    this.carts = carts;
  }

  public getAllCarts(): Promise<Cart[]> {
    return Promise.resolve(this.carts);
  }

  public getCartByBuyerId(buyerId: string): Promise<Cart> {
    const result = this.carts.filter((cart) => cart?.buyerId?.normalize() === buyerId.normalize())[0];
    if (result === undefined) {
      const lineItems : Array<LineItem> = []; 
      const newCart = new Cart({
        id: this.getNextId(),
        buyerId: this.getNextId(),
        lineItems,
      });
      return Promise.resolve(newCart);
    }
    return Promise.resolve(result);
  }

  public getCartById(id: string): Promise<Cart> {
    const result = this.carts.filter((cart) => cart.id === id)[0];
    if (result === undefined) {
      const notFoundError = new Error("Not Found Error");
      notFoundError.message = `Cart with id ${id} can't be found.`;
      return Promise.reject(notFoundError);
    }
    return Promise.resolve(result);
  }

  public getNextId(): string {
    return uuidv4();
  }
  
  public delete(cart: Cart): Promise<string> {
    const index = this.carts.findIndex(c => c.id.normalize() === cart.id.normalize())
    this.carts.splice(index, 1)
    return Promise.resolve('Cart was deleted!')
  }

  public update(cart: Cart): Promise<Cart> {
    return Promise.resolve(cart)
  }
}

export { FakeCartRepository };
