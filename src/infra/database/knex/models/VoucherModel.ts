import { Model, RelationMappings, RelationMappingsThunk} from "objection";
import { VoucherType } from "../../../../domain/entities/Voucher";

class VoucherModel extends Model {
  id!: number;
  uuid!: string;
  code!: string;
  type!: VoucherType;
  amount!: number;
  minValue?: number;

  static tableName = "vouchers";

  public static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const { CartModel } = require("./CartModel");

    return {
      cart: {
        relation: Model.BelongsToOneRelation,
        modelClass: CartModel,
        join: {
          from: "vouchers.uuid",
          to: "carts.voucherId",
        },
      },
    };
  }
}

export {VoucherModel};
