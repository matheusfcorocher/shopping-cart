import { VoucherProps, VoucherType } from "../../../../domain/entities/Voucher";
import { Voucher } from "../../../../domain/entities/index";

type SerializedVoucherProps = {
  id: string;
  code: string;
  type: VoucherType;
  amount?: number | null;
  minValue?: number | null;
}

const VoucherSerializer = {
  serialize({ id, code, type, amount, minValue }: Voucher): SerializedVoucherProps {
    return {
      id,
      code,
      type,
      amount: amount?.toUnit(),
      minValue: minValue?.toUnit(),
    };
  },
};

export { VoucherSerializer };
