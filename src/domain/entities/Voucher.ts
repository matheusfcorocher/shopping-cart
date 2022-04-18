import { Money } from "../valueObjects/Money";

type VoucherType = "percentual" | "fixed" | "free shipping";

type Voucher = {
  id: string;
  code: string;
  type: VoucherType;
  amount?: Money | null;
  minValue?: Money | null;
};

function createVoucher({ id, code, type, amount, minValue }: Voucher) : Voucher {
  return { id, code, type, amount, minValue };
};

export { VoucherType, Voucher };

export { createVoucher };
