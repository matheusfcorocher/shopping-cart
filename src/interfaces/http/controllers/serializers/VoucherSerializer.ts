import * as Voucher from "../../../../domain/entities/Voucher";

type SerializedVoucherProps = {
  id: string;
  code: string;
  type: Voucher.VoucherType;
  amount?: number | null;
  minValue?: number | null;
}

const VoucherSerializer = {
  serialize({ id, code, type, amount, minValue }: Voucher.Voucher): SerializedVoucherProps {
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
