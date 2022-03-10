import {Model} from "./index";

class BuyerModel extends Model {
  static tableName = "buyers";

  public static get relationMappings(): any {
    const Carts = require("./Carts");

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Carts,
        join: {
          from: "buyers.uuid",
          to: "carts.buyerId",
        },
      },
    };
  }
}

export {BuyerModel};
