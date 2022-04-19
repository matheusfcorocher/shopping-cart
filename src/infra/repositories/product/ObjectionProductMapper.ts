import * as Product from "../../../domain/entities/Product";
import { createMoney } from "../../../domain/valueObjects/Money";
import { ProductModel } from "../../database/knex/models/ProductModel";

const ObjectionProductMapper = {
  toEntity(dataValues: ProductModel) {
    const { uuid, name, price, available } = dataValues;

    return Product.createProduct({
      id: uuid,
      name,
      price: createMoney(price),
      available,
    });
  },
  toDatabase(product: Product.Product) {
    const { id, name, price, available } = product;
    return {
      uuid: id,
      name,
      price: price.getAmount(),
      available,
    };
  },
};

export { ObjectionProductMapper };
