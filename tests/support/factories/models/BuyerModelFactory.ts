import { BuyerModel } from "../../../../src/infra/database/knex/models/BuyerModel";
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

const BuyerModelFactory: ModelsFactory<BuyerModelData, BuyerModel> = {
  createList: function (list: Array<BuyerModelData>): Promise<Array<BuyerModel>> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: BuyerModelData): Promise<BuyerModel> {
    return Promise.resolve(BuyerModel.query().insert(data));
  },
};

export default BuyerModelFactory;
export { BuyerModelData };
