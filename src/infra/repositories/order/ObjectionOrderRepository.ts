import { Order } from "../../../domain/entities";
import { OrderRepository } from "../../../domain/repositories/OrderRepository";

class ObjectionOrderRepository implements OrderRepository {
    getAllOrders(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    store(order: Order): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getNextId(): string {
        throw new Error("Method not implemented.");
    }
}

export { ObjectionOrderRepository };