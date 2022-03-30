import { VoucherProps } from "../../../../domain/entities/Voucher";
import { Voucher } from "../../../../domain/entities/index";

const VoucherSerializer = {
  serialize({ id, code, type, amount, minValue }: Voucher): VoucherProps {
    return {
      id,
      code,
      type,
      amount,
      minValue,
    };
  },
};

export { VoucherSerializer };
