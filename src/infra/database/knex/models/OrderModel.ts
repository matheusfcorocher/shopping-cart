import { Model } from "../knex";

class OrderModel extends Model {
  static tableName = "orders";

  public static get relationMappings(): any {
    const Buyers = require("./Buyers");
    const LineItems = require("./LineItems");

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
