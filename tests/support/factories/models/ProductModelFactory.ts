import { ProductModel } from "../../../../src/infra/database/knex/models/ProductModel";
import { ModelsFactory } from "./ModelsFactory";

interface ProductModelData {
  uuid: string;
  name: string;
  price: number;
  available: number;
}

const ProductModelFactory: ModelsFactory<ProductModelData, ProductModel> = {
  createList: function (list: Array<ProductModelData>): Promise<Array<ProductModel>> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: ProductModelData): Promise<ProductModel> {
    return Promise.resolve(ProductModel.query().insert(data))
  },
};

export default ProductModelFactory;
export { ProductModelData };
