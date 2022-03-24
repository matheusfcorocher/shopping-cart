import { Voucher } from "../../../domain/entities";
import { VoucherModel } from "../../database/knex/models/VoucherModel";

const ObjectionVoucherMapper = {
  toEntity(voucherModel: VoucherModel) {
    const { uuid, code, type, amount, minValue } = voucherModel;

    return new Voucher({
      id: uuid,
      code,
      type,
      amount,
      minValue,
    });
  },
  toDatabase(voucher: Voucher) {
    const { id, code, type, amount, minValue } = voucher;
    return {
      uuid: id,
      code,
      type,
      amount,
      minValue: minValue?minValue:null,
    };
  },
};

export { ObjectionVoucherMapper };
