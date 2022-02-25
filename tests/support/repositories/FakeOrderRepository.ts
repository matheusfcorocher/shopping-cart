import { Order } from "../../../src/domain/entities";
import { OrderRepository } from "../../../src/domain/repositories/OrderRepository";
import { v4 as uuidv4 } from 'uuid';

class FakeOrderRepository implements OrderRepository {
  orders: Array<Order>;

  constructor(orders: Array<Order>) {
    this.orders = orders;
  }

  getAllOrders(): Promise<Order[]> {
    return Promise.resolve(this.orders);
  }
  createOrder(order: Order): Promise<string> {
    this.orders.push(order);
    return Promise.resolve("Order was emitted sucessfully!")
  }
  getNextId(): string {
    return uuidv4();
  }
}

export { FakeOrderRepository };
