import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import knexInstance from "../knex";

//only need one Model.knex receiving knexInstance to work Objection Model
Model.knex(knexInstance);
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
    const { CartModel } = require("./CartModel");

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
