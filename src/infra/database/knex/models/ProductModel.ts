import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class ProductModel extends Model {
  id!: number;
  uuid!: string;
  name!: string;
  price!: number;
  available!: number;

  static tableName = "products";

  public static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const LineItems =  require("./LineItemModel");

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

export {ProductModel};
