import { VoucherType } from "../../../../src/domain/entities/Voucher";
import { VoucherModel } from "../../../../src/infra/database/knex/models/VoucherModel";
import { ModelsFactory } from "./ModelsFactory";

interface VoucherModelData {
  uuid: string;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number;
}

const VoucherModelFactory: ModelsFactory<VoucherModelData, VoucherModel> = {
  createList: function (list: Array<VoucherModelData>): Promise<Array<VoucherModel>> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: VoucherModelData): Promise<VoucherModel> {
    return Promise.resolve(VoucherModel.query().insert(data))
  },
};

export default VoucherModelFactory;
export { VoucherModelData };
