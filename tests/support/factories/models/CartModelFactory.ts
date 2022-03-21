import { CartModel } from "../../../../src/infra/database/knex/models";
import { ModelsFactory } from "./ModelsFactory";

interface CartModelData {
  uuid: string;
  buyerId: string;
  voucherId?: string;
  type?: string;
  amount?: number;
  minValue?: number;
}

const CartModelFactory: ModelsFactory = {
  createList: function (list: Array<CartModelData>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: CartModelData): Promise<any> {
    return Promise.resolve(CartModel.query().insert(data)).catch((error) =>
      console.log(error)
    );
  },
};

export default CartModelFactory;
export { CartModelData };
