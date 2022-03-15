import { Model, RelationMappings, RelationMappingsThunk } from "objection";
class LineItemModel extends Model {
  uuid!: string;
  productId!: string;
  unitPrice!: number;
  quantity!: number;
  ownerId!: string;
  ownerType!: string;

  static tableName = "lineItems";

  public static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Products = require("./ProductModel");

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

export {LineItemModel};