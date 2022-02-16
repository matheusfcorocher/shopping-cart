type VoucherType = "percentual" | "fixed" | "free shipping";
export default class Voucher {
  id: number;
  code: string;
  type: VoucherType;
  amount: number;

  constructor(id: number, code: string, type: VoucherType, amount: number) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.amount = amount;
  }

  public isPercentual(): boolean {
    return this.type === "percentual";
  }

  public isFixed(): boolean {
    return this.type === "fixed";
  }

  public isFreeShipping(): boolean {
    return this.type === "free shipping";
  }
}

export { VoucherType };
