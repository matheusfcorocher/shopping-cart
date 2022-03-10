import {Model} from "./index";

class VoucherModel extends Model {
  static tableName = "vouchers";

  public static get relationMappings(): any {
    const Carts = require("./Carts");

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Carts,
        join: {
          from: "vouchers.uuid",
          to: "carts.voucherId",
        },
      },
    };
  }
}

export {VoucherModel};
