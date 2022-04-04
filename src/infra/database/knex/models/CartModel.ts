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
    const { BuyerModel } = require("./BuyerModel");
    const { LineItemModel } = require("./LineItemModel");
    const { VoucherModel } = require("./VoucherModel");

    return {
      buyer: {
        relation: Model.HasOneRelation,
        modelClass: BuyerModel,
        join: {
          from: "carts.buyerId",
          to: "buyers.uuid",
        },
      },
      voucher: {
        relation: Model.HasOneRelation,
        modelClass: VoucherModel,
        join: {
          from: "carts.voucherId",
          to: "vouchers.uuid",
        },
      },
      lineItems: {
        relation: Model.HasManyRelation,
        modelClass: LineItemModel,

        filter(builder : any) {
          builder.where('ownerType', 'cart');
        },

        beforeInsert(model : any) {
          model.ownerType = 'cart';
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
