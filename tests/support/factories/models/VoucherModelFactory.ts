import { VoucherType } from "../../../../src/domain/entities/Voucher";
import { VoucherModel } from "../../../../src/infra/database/knex/models/VoucherModel";
import { factory } from "./ModelsFactory";

interface VoucherModelData {
  uuid: string;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number;
}

const VoucherModelFactory = factory<VoucherModelData, VoucherModel>((data) =>
  VoucherModel.query().insert(data)
);

export default VoucherModelFactory;
export { VoucherModelData };
