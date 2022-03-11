import { Model } from "../knex";

class CartModel extends Model {
  static tableName = "carts";

  public static get relationMappings(): any {
    const Buyers = require("./Buyers");
    const LineItems = require("./LineItems");
    const Vouchers = require("./Vouchers");

    return {
      buyer: {
        relation: Model.HasOneRelation,
        modelClass: Buyers,
        join: {
          from: "carts.buyerId",
          to: "buyers.uuid",
        },
      },
      voucher: {
        relation: Model.HasOneRelation,
        modelClass: Vouchers,
        join: {
          from: "carts.voucherId",
          to: "vouchers.uuid",
        },
      },
      lineItems: {
        relation: Model.HasManyRelation,
        modelClass: LineItems,

        filter(builder : any) {
          builder.where('lineItemableType', 'Carts');
        },

        beforeInsert(model : any) {
          model.lineItemableType = 'Carts';
        },

        join: {
          from: 'carts.uuid',
          to: 'lineItems.ownerId'
        }
      }
    };
  }
}

export { CartModel };
