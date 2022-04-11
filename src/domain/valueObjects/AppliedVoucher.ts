import { DomainError } from "../../lib/CustomError";
import { VoucherType } from "../entities/Voucher";
import { createMoney, Money } from "./Money";

type AppliedVoucherProps = {
  voucherId: string;
  type: VoucherType;
  amount?: Money | null;
  minValue?: Money | null;
};

abstract class AppliedVoucher {
  voucherId: string;
  type: VoucherType;
  amount?: Money | null;
  minValue?: Money | null;

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

  abstract apply(subtotal: Money, shipping: Money): Money;
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

  public apply(subtotal: Money, shipping: Money): Money {
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
      const internalError = new DomainError({
        title: "Internal Error",
        code: "INTERNAL_ERROR",
        message: "PercentualVoucher must have an amount between 0 and 100.",
      });
      throw internalError;
    } 
  }

  public apply(subtotal: Money, shipping: Money): Money {
    return subtotal.multiply(this.amount?.getAmount()!).divide(100);
  }

  private isInRange(): boolean {
    return this.amount!.greaterThanOrEqual(createMoney(0)) && this.amount!.lessThanOrEqual(createMoney(100))
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

  public apply(subtotal: Money, shipping: Money): Money {
    if (subtotal.greaterThanOrEqual(this.minValue!)) {
      return shipping;
    }
    return createMoney(0);
  }
}

export { FixedVoucher, PercentualVoucher, ShippingVoucher, AppliedVoucher, AppliedVoucherProps };
