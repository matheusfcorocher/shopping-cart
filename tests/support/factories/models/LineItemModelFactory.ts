import { LineItemModel } from "../../../../src/infra/database/knex/models/LineItemModel";
import { factory } from "./ModelsFactory";

interface LineItemModelData {
  uuid: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  ownerId: string;
  ownerType: string;
}

const LineItemModelFactory = factory<LineItemModelData, LineItemModel>((data) =>
  LineItemModel.query().insert(data)
);

export default LineItemModelFactory;
export { LineItemModelData };
