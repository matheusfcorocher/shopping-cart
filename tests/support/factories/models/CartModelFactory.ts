import { CartModel } from "../../../../src/infra/database/knex/models/CartModel";
import { factory } from "./ModelsFactory";

interface CartModelData {
  uuid: string;
  buyerId: string;
  voucherId?: string;
  type?: string;
  amount?: number;
  minValue?: number;
}

const CartModelFactory = factory<CartModelData, CartModel>((data) =>
  CartModel.query().insert(data)
);

export default CartModelFactory;
export { CartModelData };
