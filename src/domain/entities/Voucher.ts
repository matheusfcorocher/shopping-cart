type VoucherType = "percentual" | "fixed" | "free shipping";

type VoucherProps = {
  id: string;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number | null;
}
export default class Voucher {
  id: string;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number | null;

  constructor({id, code, type, amount, minValue} : VoucherProps) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.amount = amount;
    this.minValue = minValue
  }
}

export { VoucherType };
