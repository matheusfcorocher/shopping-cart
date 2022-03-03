import { Order } from "../entities";

interface OrderRepository {
  getAllOrders(): Promise<Array<Order>>;
  store(order: Order): Promise<string>;
  getNextId() : string;
}

export { OrderRepository };
