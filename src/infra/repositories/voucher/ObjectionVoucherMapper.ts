import * as Voucher from "../../../domain/entities/Voucher";
import { createMoney } from "../../../domain/valueObjects/Money";
import { VoucherModel } from "../../database/knex/models/VoucherModel";

const ObjectionVoucherMapper = {
  toEntity(voucherModel: VoucherModel) {
    const { uuid, code, type, amount, minValue } = voucherModel;
    return Voucher.createVoucher({
      id: uuid,
      code,
      type,
      amount: amount?createMoney(amount):undefined,
      minValue: minValue?createMoney(minValue):undefined,
    });
  },
  toDatabase(voucher: Voucher.Voucher) {
    const { id, code, type, amount, minValue } = voucher;
    return {
      uuid: id,
      code,
      type,
      amount: amount?.getAmount(),
      minValue: minValue?minValue?.getAmount():null,
    };
  },
};

export { ObjectionVoucherMapper };
