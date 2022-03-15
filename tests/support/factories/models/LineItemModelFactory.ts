import { LineItemModel } from "../../../../src/infra/database/knex/models";
import { ModelsFactory } from "./ModelsFactory";

interface LineItemModelData {
  uuid: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  ownerId: string;
  ownerType: string;
}

const LineItemModelFactory: ModelsFactory = {
  createList: function (list: Array<LineItemModelData>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: LineItemModelData): Promise<any> {
    return Promise.resolve(LineItemModel.query().insert(data)).catch((error) =>
      console.log(error)
    );
  },
  returnModel: function (): typeof LineItemModel {
    return LineItemModel;
  },
};

export default LineItemModelFactory;
export { LineItemModelData };
