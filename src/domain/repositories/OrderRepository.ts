import { Order } from "../entities";

interface OrderRepository {
  getAllOrders(): Promise<Array<Order>>;
  createOrder(order: Order): Promise<string>;
  getNextId() : string;
}

export { OrderRepository };
