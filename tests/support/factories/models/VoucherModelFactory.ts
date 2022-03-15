import { VoucherType } from "../../../../src/domain/entities/Voucher";
import { VoucherModel } from "../../../../src/infra/database/knex/models";
import { ModelsFactory } from "./ModelsFactory";

interface VoucherModelData {
  uuid: string;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number;
}

const VoucherModelFactory: ModelsFactory = {
  createList: function (list: Array<VoucherModelData>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (data: VoucherModelData): Promise<any> {
    return Promise.resolve(VoucherModel.query().insert(data)).catch((error) =>
      console.log(error)
    );
  },
  returnModel: function (): typeof VoucherModel {
    return VoucherModel;
  },
};

export default VoucherModelFactory;
export { VoucherModelData };
