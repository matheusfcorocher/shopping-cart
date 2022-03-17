import { BuyerModel } from "../../../../src/infra/database/knex/models";
import { ModelsFactory } from "./ModelsFactory";

interface BuyerModelData {
  uuid: string;
  name: string;
  birthDate: Date;
  email: string;
  postalCode: string;
  street: string;
  district: string;
  city: string;
  country: string;
}

const BuyerModelFactory: ModelsFactory = {
  createList: function (list: Array<BuyerModelData>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: BuyerModelData): Promise<any> {
    return Promise.resolve(BuyerModel.query().insert(data)).catch((error) =>
      console.log(error)
    );
  },
};

export default BuyerModelFactory;
export { BuyerModelData };
