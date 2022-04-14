import { PaymentMethod } from "../../../../src/domain/entities/Order";
import { OrderModel } from "../../../../src/infra/database/knex/models/OrderModel";
import { factory } from "./ModelsFactory";

interface OrderModelData {
  uuid: string;
  buyerId: string;
  discount: number;
  paymentMethod: PaymentMethod;
}

const OrderModelFactory = factory<OrderModelData, OrderModel>((data) =>
  OrderModel.query().insert(data)
);

export default OrderModelFactory;
export { OrderModelData };
