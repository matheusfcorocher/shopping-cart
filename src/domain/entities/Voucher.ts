type VoucherType = "percentual" | "fixed" | "free shipping";
export default class Voucher {
  id: number;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number;

  constructor(id: number, code: string, type: VoucherType, amount: number, minValue?: number) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.amount = amount;
    this.minValue = minValue;
  }

  public isPercentual(): boolean {
    return this.type === "percentual";
  }

  public isFixed(): boolean {
    return this.type === "fixed";
  }

  public isFreeShipping(): boolean {
    return this.type === "free shipping" && this.minValue !== undefined;
  }
}

export { VoucherType };
