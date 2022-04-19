import { v4 as uuidv4 } from "uuid";
import * as Product from "../../../domain/entities/Product";
import {
  ProductDataProps,
  ProductRepository,
} from "../../../domain/repositories/ProductRepository";
import { InfrastructureError } from "../../../lib/CustomError";
import { ProductModel } from "../../database/knex/models/ProductModel";
import { ObjectionProductMapper } from "./ObjectionProductMapper";

class ObjectionProductRepository implements ProductRepository {
  public getAllProducts(): Promise<Product.Product[]> {
    return ProductModel.query().then((data) =>
      data.map((d) => ObjectionProductMapper.toEntity(d))
    );
  }

  public getProductById(id: string): Promise<Product.Product> {
    return this.getProductModelById(id).then((data) =>
      ObjectionProductMapper.toEntity(data!)
    );
  }

  public getNextId(): string {
    return uuidv4();
  }

  public async update(id: string, data: ProductDataProps): Promise<Product.Product> {
    const product = await this.getProductModelById(id);
    const {
      name,
      price,
      available
    } = data;
    return product
      .$query()
      .patchAndFetch({
        name,
        price: price?.getAmount(),
        available
      })
      .then((result) => ObjectionProductMapper.toEntity(result));
  }

  private getProductModelById(id: string): Promise<ProductModel> {
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
}

export default ObjectionProductRepository;
