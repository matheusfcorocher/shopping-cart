import {Model} from "./index";

class LineItems extends Model {
  static tableName = "lineItems";

  public static get relationMappings(): any {
    const Products = require("./Products");

    return {
      product: {
        relation: Model.HasOneRelation,
        modelClass: Products,
        join: {
          from: "lineItems.productId",
          to: "products.uuid",
        },
      },
    };
  }
}

export {LineItems};