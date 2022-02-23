import { VoucherType } from "../entities/Voucher";

type AppliedVoucherProps = {
  voucherId: number;
  type: VoucherType;
  amount: number;
};

abstract class AppliedVoucher {
  voucherId: number;
  type: VoucherType;
  amount: number;

  constructor({
    voucherId,
    type,
    amount
  }: AppliedVoucherProps) {
    this.voucherId = voucherId;
    this.type = type;
    this.amount = amount;
  }

  abstract apply(subtotal: number, shipping: number): number;
}

//FixedVoucher

class FixedVoucher extends AppliedVoucher {
  constructor({
    voucherId,
    type,
    amount
  }: AppliedVoucherProps) {
    super({ voucherId, type, amount});
  }

  public apply(subtotal: number, shipping: number): number {
    return this.amount;
  }
}

//PercentualVoucher

class PercentualVoucher extends AppliedVoucher {
  constructor({
    voucherId,
    type,
    amount
  }: AppliedVoucherProps) {
    super({ voucherId, type, amount});
  }

  public apply(subtotal: number, shipping: number): number {
    return subtotal * this.amount;
  }
}

//ShippingVoucher

interface ShippingVoucherProps extends AppliedVoucherProps {
  minValue: number;
}

class ShippingVoucher extends AppliedVoucher {
  minValue: number;

  constructor({
    voucherId,
    type,
    amount,
    minValue,
  }: ShippingVoucherProps) {
    super({ voucherId, type, amount});
    this.minValue = minValue;
  }

  public apply(subtotal: number, shipping: number): number {
    if (subtotal >= this.minValue) {
      return shipping;
    }
    return 0;
  }
}

export { FixedVoucher, PercentualVoucher, ShippingVoucher, AppliedVoucher };