import { v4 as uuidv4 } from 'uuid';
import { Order } from "../../../src/domain/entities/Order";
import { OrderRepository } from "../../../src/domain/repositories/OrderRepository";

class FakeOrderRepository implements OrderRepository {
  orders: Array<Order>;

  constructor(orders: Array<Order>) {
    this.orders = orders;
  }

  public getAllOrders(): Promise<Order[]> {
    return Promise.resolve(this.orders);
  }

  public getNextId(): string {
    return uuidv4();
  }
  
  public store(order: Order): Promise<string> {
    this.orders.push(order);
    return Promise.resolve("Order was emitted sucessfully!")
  }
  
}

export { FakeOrderRepository };
