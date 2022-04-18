import { Order } from "../entities/Order";

interface OrderRepository {
  getAllOrders(): Promise<Array<Order>>;
  store(order: Order): Promise<string>;
  getNextId() : string;
}

export { OrderRepository };
