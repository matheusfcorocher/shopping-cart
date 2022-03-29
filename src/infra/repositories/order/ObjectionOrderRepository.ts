import { transaction } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Order } from "../../../domain/entities";
import { LineItem } from "../../../domain/entities/Cart";
import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { LineItemModel } from "../../database/knex/models/LineItemModel";
import { OrderModel } from "../../database/knex/models/OrderModel";
import { ObjectionLineItemMapper } from "../lineItem/ObjectionLineItemMapper";
import { ObjectionOrderMapper } from "./ObjectionOrderMapper";

interface Owner {
  ownerId: string;
  ownerType: string;
}
class ObjectionOrderRepository implements OrderRepository {
  public getAllOrders(): Promise<Order[]> {
    return OrderModel.query().then((data) =>
      Promise.all(
        data.map((d) => {
          return this.transformOrderModelToOrder(d);
        })
      )
    );
  }
  public store(order: Order): Promise<string> {
    return transaction(OrderModel, async (BoundOrderModel) => {
      const { lineItems } = order;

      const data = ObjectionOrderMapper.toDatabase(order);
      const boundOrderModel = await BoundOrderModel
        .query()
        .insertAndFetch(data);

      const promises = lineItems.map(async (lineItem) => {
        return this.storeLineItem(lineItem, boundOrderModel);
      });

      await Promise.all(promises);

      return 'Order was created successfully!';
    });
  }
  public getNextId(): string {
    return uuidv4();
  }

  private async transformOrderModelToOrder(order: OrderModel): Promise<Order> {
    const owner: Owner = {
      ownerId: order.uuid,
      ownerType: "order",
    };
    const lineItems = await this.getAllLineItemsByOwner(owner);

    return ObjectionOrderMapper.toEntity(order, lineItems);
  }

  private getAllLineItemsByOwner(owner: Owner): Promise<LineItem[]> {
    return this.getAllLineItemsModelsByOwner(owner).then((data) =>
      data.map((d) => ObjectionLineItemMapper.toEntity(d))
    );
  }

  private getAllLineItemsModelsByOwner(owner: Owner): Promise<LineItemModel[]> {
    const { ownerId, ownerType } = owner;

    return LineItemModel.query()
      .where({
        ownerId,
        ownerType,
      })
      .then((data) => {
        if (data === undefined) {
          const notFoundError = new Error("Not Found Error");
          //   notFoundError.CODE = "NOTFOUND_ERROR";
          notFoundError.message = `Line with ownerId ${ownerId} can't be found for ${ownerType}.`;
          return Promise.reject(notFoundError);
        }
        return data;
      });
  }

  private storeLineItem(
    lineItem: LineItem,
    orderModel: OrderModel
  ): Promise<String> {
    const uuid = this.getNextId();
    const { productId, unitPrice, quantity } = lineItem;
    const data = {
      uuid,
      productId,
      unitPrice,
      quantity,
    };
    return orderModel
      .$relatedQuery("lineItems")
      .insert(data)
      .then(() => "LineItem was created with success!");
  }
}

export { ObjectionOrderRepository };
