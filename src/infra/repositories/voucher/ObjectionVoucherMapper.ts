import { Voucher } from "../../../domain/entities";
import { VoucherType } from "../../../domain/entities/Voucher";

interface dbVoucherProps {
    id: number;
    uuid: string;
    code: string;
    type: VoucherType;
    amount: number;
    minValue?: number;
}

const ObjectionVoucherMapper = {
  toEntity(dataValues: dbVoucherProps) {
    const { uuid, code, type, amount, minValue } = dataValues;

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

export { ObjectionVoucherMapper, dbVoucherProps};
