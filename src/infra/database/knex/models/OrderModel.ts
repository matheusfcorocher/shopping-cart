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
    const BuyerModel = require("./BuyerModel");
    const LineItemModel = require("./LineItemModel");

    return {
      buyer: {
        relation: Model.HasOneRelation,
        modelClass: BuyerModel,
        join: {
          from: "orders.buyerId",
          to: "buyers.uuid",
        },
      },
      lineItems: {
        relation: Model.HasManyRelation,
        modelClass: LineItemModel,

        // filter(builder : any) {
        //   builder.where('lineItemableType', 'Orders');
        // },

        // beforeInsert(model : any) {
        //   model.lineItemableType = 'Orders';
        // },

        join: {
          from: 'orders.uuid',
          to: 'lineItems.ownerId'
        }
      }
    };
  }
}

export { OrderModel };
