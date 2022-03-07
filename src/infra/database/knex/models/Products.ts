import {Model} from "./index";

class Products extends Model {
  static tableName = "products";

  public static get relationMappings(): any {
    const LineItems =  require("./LineItems");

    return {
      lineItem: {
        relation: Model.BelongsToOneRelation,
        modelClass: LineItems,
        join: {
          from: "products.uuid",
          to: "lineItems.productId",
        },
      },
    };
  }
}

export {Products};
