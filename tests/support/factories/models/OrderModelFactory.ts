import { PaymentMethod } from "../../../../src/domain/entities/Order";
import { OrderModel } from "../../../../src/infra/database/knex/models";
import { ModelsFactory } from "./ModelsFactory";

interface OrderModelData {
  uuid: string;
  buyerId: string;
  discount: number;
  paymentMethod: PaymentMethod;
}

const OrderModelFactory: ModelsFactory = {
  createList: function (list: Array<OrderModelData>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: OrderModelData): Promise<any> {
    return Promise.resolve(OrderModel.query().insert(data)).catch((error) =>
      console.log(error)
    );
  },
  returnModel: function (): typeof OrderModel {
    return OrderModel;
  },
};

export default OrderModelFactory;
export { OrderModelData };
