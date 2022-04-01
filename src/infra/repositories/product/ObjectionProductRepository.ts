import { v4 as uuidv4 } from "uuid";
import { Product } from "../../../domain/entities";
import {
  ProductDataProps,
  ProductRepository,
} from "../../../domain/repositories/ProductRepository";
import { DbError } from "../../../lib/CustomError";
import { ProductModel } from "../../database/knex/models/ProductModel";
import { ObjectionProductMapper } from "./ObjectionProductMapper";

class ObjectionProductRepository implements ProductRepository {
  public getAllProducts(): Promise<Product[]> {
    return ProductModel.query().then((data) =>
      data.map((d) => ObjectionProductMapper.toEntity(d))
    );
  }

  public getProductById(id: string): Promise<Product> {
    return this.getProductModelById(id).then((data) =>
      ObjectionProductMapper.toEntity(data)
    );
  }

  public getNextId(): string {
    return uuidv4();
  }

  public async update(id: string, data: ProductDataProps): Promise<Product> {
    const product = await this.getProductModelById(id);
    return product
      .$query()
      .patchAndFetch(data)
      .then((result) => ObjectionProductMapper.toEntity(result));
  }

  private getProductModelById(id: string): Promise<ProductModel> {
    return ProductModel.query()
      .findOne({
        uuid: id,
      })
      .then((data) => {
        return data!;
      })
      .catch((err) => {
        const notFoundError = new DbError({
          title: "Not Found Error",
          status: 404,
          detail: `Couldn't find product with id: ${id} in database. Verify if you are passing the correct productId.`,
          stack: err.stack,
        });
        return Promise.reject(notFoundError);
      });
  }
}

export default ObjectionProductRepository;
