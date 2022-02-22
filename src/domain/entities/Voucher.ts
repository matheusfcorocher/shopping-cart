type VoucherType = "percentual" | "fixed" | "free shipping";

type VoucherProps = {
  id: number;
  code: string;
  type: VoucherType;
  amount: number;
  minValue: number;
}
export default class Voucher {
  id: number;
  code: string;
  type: VoucherType;
  amount: number;
  minValue: number;

  constructor({id, code, type, amount, minValue} : VoucherProps) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.amount = amount;
    this.minValue = minValue
  }
}

export { VoucherType };
