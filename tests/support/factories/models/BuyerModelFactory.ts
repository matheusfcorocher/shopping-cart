import { BuyerModel } from "../../../../src/infra/database/knex/models/BuyerModel";
import { factory } from "./ModelsFactory";

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

const BuyerModelFactory = factory<BuyerModelData, BuyerModel>((data) => BuyerModel.query().insert(data))

export default BuyerModelFactory;
export { BuyerModelData };
