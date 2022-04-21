import { transaction } from "objection";
import { v4 as uuidv4 } from "uuid";
import * as Order from "../../../domain/entities/Order";
import { LineItem } from "../../../domain/entities/Cart";
import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { InfrastructureError } from "../../../lib/errors/InfrastructureError";
import { LineItemModel } from "../../database/knex/models/LineItemModel";
import { OrderModel } from "../../database/knex/models/OrderModel";
import { ObjectionLineItemMapper } from "../lineItem/ObjectionLineItemMapper";
import { ObjectionOrderMapper } from "./ObjectionOrderMapper";

interface Owner {
  ownerId: string;
  ownerType: string;
}

//public functions

const ObjectionOrderRepository: OrderRepository = {
  getAllOrders: function (): Promise<Order.Order[]> {
    return OrderModel.query().then((data) =>
      Promise.all(
        data.map((d) => {
          return transformOrderModelToOrder(d);
        })
      )
    );
  },
  store: function (order: Order.Order): Promise<string> {
    return transaction(OrderModel, async (BoundOrderModel) => {
      const { lineItems } = order;

      const data = ObjectionOrderMapper.toDatabase(order);
      const boundOrderModel = await BoundOrderModel.query().insertAndFetch(
        data
      );

      const promises = lineItems.map(async (lineItem) => {
        return storeLineItem(lineItem, boundOrderModel);
      });

      await Promise.all(promises);

      return "Order was created successfully!";
    });
  },
  getNextId: function (): string {
    return uuidv4();
  },
};

//private functions

async function transformOrderModelToOrder(
  order: OrderModel
): Promise<Order.Order> {
  const owner: Owner = {
    ownerId: order.uuid,
    ownerType: "order",
  };
  const lineItems = await getAllLineItemsByOwner(owner);

  return ObjectionOrderMapper.toEntity(order, lineItems);
}

function getAllLineItemsByOwner(owner: Owner): Promise<LineItem[]> {
  return getAllLineItemsModelsByOwner(owner).then((data) =>
    data.map((d) => ObjectionLineItemMapper.toEntity(d))
  );
}

function getAllLineItemsModelsByOwner(owner: Owner): Promise<LineItemModel[]> {
  const { ownerId, ownerType } = owner;

  return LineItemModel.query()
    .where({
      ownerId,
      ownerType,
    })
    .then((data) => {
      if (data === undefined) {
        const notFoundError = InfrastructureError.create({
          name: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `Line with ownerId ${ownerId} can't be found for ${ownerType}.`,
        });
        return Promise.reject(notFoundError);
      }
      return data;
    });
}

function storeLineItem(
  lineItem: LineItem,
  orderModel: OrderModel
): Promise<String> {
  const uuid = ObjectionOrderRepository.getNextId();
  const { productId, unitPrice, quantity } = lineItem;
  const data = {
    uuid,
    productId,
    unitPrice: unitPrice.getAmount(),
    quantity,
  };
  return orderModel
    .$relatedQuery("lineItems")
    .insert(data)
    .then(() => "LineItem was created with success!");
}

export default ObjectionOrderRepository;
