import { PaymentMethod } from "../../../../src/domain/entities/Order";
import { OrderModel } from "../../../../src/infra/database/knex/models/OrderModel";
import { ModelsFactory } from "./ModelsFactory";

interface OrderModelData {
  uuid: string;
  buyerId: string;
  discount: number;
  paymentMethod: PaymentMethod;
}

const OrderModelFactory: ModelsFactory<OrderModelData, OrderModel> = {
  createList: function (list: Array<OrderModelData>): Promise<Array<OrderModel>> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: OrderModelData): Promise<OrderModel> {
    return Promise.resolve(OrderModel.query().insert(data))
  },
};

export default OrderModelFactory;
export { OrderModelData };
