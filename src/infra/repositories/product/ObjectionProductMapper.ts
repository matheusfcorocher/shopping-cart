import { Product } from "../../../domain/entities";
import { ProductModel } from "../../database/knex/models/ProductModel";

const ObjectionProductMapper = {
  toEntity(dataValues: ProductModel) {
    const { uuid, name, price, available } = dataValues;

    return new Product({
      id: uuid,
      name,
      price,
      available,
    });
  },
  toDatabase(product: Product) {
    const { id, name, price, available } = product;
    return {
      uuid: id,
      name,
      price,
      available,
    };
  },
};

export { ObjectionProductMapper };
