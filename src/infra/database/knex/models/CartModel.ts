import { Model, RelationMappings, RelationMappingsThunk } from "objection";
class CartModel extends Model {
  id!: number;
  uuid!: string;
  buyerId!: string;
  voucherId?: string;
  type?: string;
  amount?: number | null;
  minValue?: number | null;

  static tableName = "carts";

  public static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Buyers = require("./BuyerModel");
    const LineItems = require("./LineItemModel");
    const Vouchers = require("./VoucherModel");

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
