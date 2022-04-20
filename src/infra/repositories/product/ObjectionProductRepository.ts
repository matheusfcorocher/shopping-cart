import { v4 as uuidv4 } from "uuid";
import * as Product from "../../../domain/entities/Product";
import {
  ProductDataProps,
  ProductRepository,
} from "../../../domain/repositories/ProductRepository";
import { InfrastructureError } from "../../../lib/CustomError";
import { ProductModel } from "../../database/knex/models/ProductModel";
import { ObjectionProductMapper } from "./ObjectionProductMapper";

//public functions

const ObjectionProductRepository: ProductRepository = {
  getAllProducts: function (): Promise<Product.Product[]> {
    return ProductModel.query().then((data) =>
      data.map((d) => ObjectionProductMapper.toEntity(d))
    );
  },
  getProductById: function (id: string): Promise<Product.Product> {
    return getProductModelById(id).then((data) =>
      ObjectionProductMapper.toEntity(data!)
    );
  },
  getNextId: function (): string {
    return uuidv4();
  },
  update: async function (
    id: string,
    data: ProductDataProps
  ): Promise<Product.Product> {
    const product = await getProductModelById(id);
    const { name, price, available } = data;
    return product
      .$query()
      .patchAndFetch({
        name,
        price: price?.getAmount(),
        available,
      })
      .then((result) => ObjectionProductMapper.toEntity(result));
  },
};

//private functions

function getProductModelById(id: string): Promise<ProductModel> {
  return ProductModel.query()
    .findOne({
      uuid: id,
    })
    .then((data) => {
      if (!data) throw new Error("Product Model is undefined.");
      return data!;
    })
    .catch((error) => {
      const notFoundError = new InfrastructureError({
        title: "Not Found Error",
        code: "NOTFOUND_ERROR",
        message: `Couldn't find product with id: ${id} in database. Verify if you are passing the correct productId.`,
        detail: error.message,
      });

      throw notFoundError;
    });
}

export default ObjectionProductRepository;
