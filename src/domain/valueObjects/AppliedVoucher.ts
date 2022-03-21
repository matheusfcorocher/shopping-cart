import { VoucherType } from "../entities/Voucher";

type AppliedVoucherProps = {
  voucherId: string;
  type: VoucherType;
  amount?: number | null;
  minValue?: number | null;
};

abstract class AppliedVoucher {
  voucherId: string;
  type: VoucherType;
  amount?: number | null;
  minValue?: number | null;

  constructor({
    voucherId,
    type,
    amount,
    minValue
  }: AppliedVoucherProps) {
    this.voucherId = voucherId;
    this.type = type;
    this.amount = amount;
    this.minValue = minValue;
  }

  abstract apply(subtotal: number, shipping: number): number;
}

//FixedVoucher

class FixedVoucher extends AppliedVoucher {
  constructor({
    voucherId,
    type,
    amount,
  }: AppliedVoucherProps) {
    super({ voucherId, type, amount});
  }

  public apply(subtotal: number, shipping: number): number {
    return this.amount!;
  }
}

//PercentualVoucher

class PercentualVoucher extends AppliedVoucher {
  constructor({
    voucherId,
    type,
    amount,
  }: AppliedVoucherProps) {
    super({ voucherId, type, amount});
    if(!this.isInRange()) {
      const internalError = new Error("Internal Error")
      internalError.message = "PercentualVoucher must have an amount between 0 and 100."
      throw internalError;
    } 
  }

  public apply(subtotal: number, shipping: number): number {
    return subtotal * this.amount!/100;
  }

  private isInRange(): boolean {
    return this.amount! >= 0 && this.amount! <= 100
  }
}

//ShippingVoucher
class ShippingVoucher extends AppliedVoucher {

  constructor({
    voucherId,
    type,
    minValue,
  }: AppliedVoucherProps) {
    super({ voucherId, type, minValue});
  }

  public apply(subtotal: number, shipping: number): number {
    if (subtotal >= this.minValue!) {
      return shipping;
    }
    return 0;
  }
}

export { FixedVoucher, PercentualVoucher, ShippingVoucher, AppliedVoucher };
