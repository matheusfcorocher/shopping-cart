import * as Order from "../../../domain/entities/Order";
import { LineItems } from "../../../domain/entities/Cart";
import { createMoney } from "../../../domain/valueObjects/Money";
import { OrderModel } from "../../database/knex/models/OrderModel";

const ObjectionOrderMapper = {
  toEntity(orderModel: OrderModel, lineItems: LineItems) {
    const {
      uuid,
      buyerId,
      discount,
      paymentMethod,
    } = orderModel;

    return Order.createOrder({
      id: uuid,
      buyerId,
      lineItems,
      discount: createMoney(discount),
      paymentMethod,
    });
  },
  toDatabase(order: Order.Order) {
    const { id, buyerId, discount, paymentMethod } = order;
    return {
      uuid: id,
      buyerId,
      discount: discount.getAmount(),
      paymentMethod,
    };
  },
};

export { ObjectionOrderMapper };
