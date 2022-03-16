import { v4 as uuidv4 } from "uuid";
import { Product } from "../../../domain/entities";
import {
  ProductDataProps,
  ProductRepository,
} from "../../../domain/repositories/ProductRepository";
import { ProductModel } from "../../database/knex/models/index";
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
        if (data === undefined) {
          const notFoundError = new Error("Not Found Error");
          //   notFoundError.CODE = "NOTFOUND_ERROR";
          notFoundError.message = `Product with id ${id} can't be found.`;
          return Promise.reject(notFoundError);
        }
        return data;
      });
  }
}

export default ObjectionProductRepository;
