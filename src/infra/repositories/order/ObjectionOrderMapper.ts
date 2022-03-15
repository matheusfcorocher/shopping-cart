import { Order } from "../../../domain/entities";
import { LineItems } from "../../../domain/entities/Cart";
import { OrderModel } from "../../database/knex/models";

const ObjectionOrderMapper = {
  toEntity(orderModel: OrderModel, lineItems: LineItems) {
    const {
      uuid,
      buyerId,
      discount,
      paymentMethod,
    } = orderModel;

    return new Order({
      id: uuid,
      buyerId,
      lineItems,
      discount,
      paymentMethod,
    });
  },
  toDatabase(order: Order) {
    const { id, buyerId, discount, paymentMethod } = order;
    return {
      uuid: id,
      buyerId,
      discount,
      paymentMethod,
    };
  },
};

export { ObjectionOrderMapper };
