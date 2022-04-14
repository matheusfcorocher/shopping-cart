import { ProductModel } from "../../../../src/infra/database/knex/models/ProductModel";
import { factory } from "./ModelsFactory";

interface ProductModelData {
  uuid: string;
  name: string;
  price: number;
  available: number;
}

const ProductModelFactory = factory<ProductModelData, ProductModel>((data) =>
  ProductModel.query().insert(data))
;

export default ProductModelFactory;
export { ProductModelData };
