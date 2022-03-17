import { ProductModel } from "../../../../src/infra/database/knex/models";
import { ModelsFactory } from "./ModelsFactory";

interface ProductModelData {
  uuid: string;
  name: string;
  price: number;
  available: number;
}

const ProductModelFactory: ModelsFactory = {
  createList: function (list: Array<ProductModelData>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: ProductModelData): Promise<any> {
    return Promise.resolve(ProductModel.query().insert(data)).catch((error) =>
      console.log(error)
    );
  },
};

export default ProductModelFactory;
export { ProductModelData };
