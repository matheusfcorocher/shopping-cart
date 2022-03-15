import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import { PaymentMethod } from "../../../../domain/entities/Order";

class OrderModel extends Model {
  id!: number;
  uuid!: string;
  buyerId!: string;
  discount!: number;
  paymentMethod!: PaymentMethod;

  static tableName = "orders";

  public static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Buyers = require("./BuyerModel");
    const LineItems = require("./LineItemModel");

    return {
      buyer: {
        relation: Model.HasOneRelation,
        modelClass: Buyers,
        join: {
          from: "orders.buyerId",
          to: "buyers.uuid",
        },
      },
      lineItems: {
        relation: Model.HasManyRelation,
        modelClass: LineItems,

        filter(builder : any) {
          builder.where('lineItemableType', 'Orders');
        },

        beforeInsert(model : any) {
          model.lineItemableType = 'Orders';
        },

        join: {
          from: 'orders.uuid',
          to: 'lineItems.ownerId'
        }
      }
    };
  }
}

export { OrderModel };
