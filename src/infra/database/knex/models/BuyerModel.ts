import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class BuyerModel extends Model {
  id!: number;
  uuid!: string;
  name!: string;
  birthDate!: Date;
  email!: string;
  postalCode!: string;
  street!: string;
  district!: string;
  city!: string;
  country!: string;

  static tableName = "buyers";

  public static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const CartModel = require("./CartModel");

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: CartModel,
        join: {
          from: "buyers.uuid",
          to: "carts.buyerId",
        },
      },
    };
  }
}

export {BuyerModel};
