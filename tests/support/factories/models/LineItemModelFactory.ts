import { LineItemModel } from "../../../../src/infra/database/knex/models/LineItemModel";
import { ModelsFactory } from "./ModelsFactory";

interface LineItemModelData {
  uuid: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  ownerId: string;
  ownerType: string;
}

const LineItemModelFactory: ModelsFactory<LineItemModelData, LineItemModel> = {
  createList: function (list: Array<LineItemModelData>): Promise<Array<LineItemModel>> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      throw error;
    }
  },
  create: function (data: LineItemModelData): Promise<LineItemModel> {
    return Promise.resolve(LineItemModel.query().insert(data))
  },
};

export default LineItemModelFactory;
export { LineItemModelData };
