type VoucherType = "percentual" | "fixed" | "free shipping";
export default class Voucher {
  id: number;
  code: string;
  type: VoucherType;
  amount: number;
  minValue: number;

  constructor(id: number, code: string, type: VoucherType, amount: number, minValue?: number) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.amount = amount;
    if(minValue === undefined)
      this.minValue = -1;
    else
      this.minValue = minValue;
  }

  private isPercentual(): boolean {
    return this.type === "percentual";
  }

  private isFixed(): boolean {
    return this.type === "fixed";
  }

  private isFreeShipping(): boolean {
    return this.type === "free shipping" && this.hasMinValue();
  }

  private hasMinValue() : boolean {
    return this.minValue !== -1;
  }

  public applySubTotalDiscount(subTotal: number): number {
    if (this.isPercentual()) {
      return subTotal * this.amount;
    } else if (this.isFixed()) {
      return this.amount;
    }

    return 0;
  }

  public applyShippingDiscount(subTotal: number, shipping: number) : number {
    if(!this.hasMinValue())
      return -1;
    else if (this.isFreeShipping() && subTotal >= this.minValue) {
      return shipping;
    } 

    return -1;
  }
}

export { VoucherType };
