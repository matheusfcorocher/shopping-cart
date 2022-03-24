import { CartModel } from "../../../../src/infra/database/knex/models/CartModel";
import { ModelsFactory } from "./ModelsFactory";

interface CartModelData {
  uuid: string;
  buyerId: string;
  voucherId?: string;
  type?: string;
  amount?: number;
  minValue?: number;
}

const CartModelFactory: ModelsFactory<CartModelData, CartModel> = {
  createList: function (list: Array<CartModelData>): Promise<Array<CartModel>> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: CartModelData): Promise<CartModel> {
    return Promise.resolve(CartModel.query().insert(data))
  },
};

export default CartModelFactory;
export { CartModelData };
