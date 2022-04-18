import { DomainError } from "../../lib/CustomError";
import { Voucher, VoucherType } from "../entities/Voucher";
import { createMoney, Money } from "./Money";

type AppliedVoucher = {
  voucherId: string;
  type: VoucherType;
  amount?: Money | null;
  minValue?: Money | null;
  // apply: ({subtotal, shipping} : ApplyProps) => Money;
};

type ApplyProps = {
  subtotal: Money;
  shipping: Money;
  appliedVoucher: AppliedVoucher;
};

type ApplyPercentualVoucherProps = {
  subtotal: Money;
  appliedVoucher: AppliedVoucher;
};

//public functions

function createFixedVoucher({
  voucherId,
  type,
  amount,
}: AppliedVoucher): AppliedVoucher {
  return { voucherId, type, amount };
}

function createPercentualVoucher({
  voucherId,
  type,
  amount,
}: AppliedVoucher): AppliedVoucher {
  if (!isInRange({ voucherId, type, amount })) {
    const internalError = new DomainError({
      title: "Internal Error",
      code: "INTERNAL_ERROR",
      message: "PercentualVoucher must have an amount between 0 and 100.",
    });
    throw internalError;
  }
  return { voucherId, type, amount };
}

function createFreeShippingVoucher({
  voucherId,
  type,
  minValue,
}: AppliedVoucher): AppliedVoucher {
  return { voucherId, type, minValue };
}

function applyDiscount({
  subtotal,
  shipping,
  appliedVoucher,
}: ApplyProps): Money {
  function applyFixedDiscount(appliedVoucher: AppliedVoucher): Money {
    return appliedVoucher.amount!;
  }

  function applyFreeShippingDiscount({
    subtotal,
    shipping,
    appliedVoucher,
  }: ApplyProps): Money {
    if (subtotal.greaterThanOrEqual(appliedVoucher.minValue!)) {
      return shipping;
    }
    return createMoney(0);
  }

  function applyPercentualDiscount({
    subtotal,
    appliedVoucher,
  }: ApplyPercentualVoucherProps): Money {
    return subtotal.multiply(appliedVoucher.amount?.getAmount()!).divide(100);
  }

  switch (appliedVoucher.type) {
    case "fixed":
      return applyFixedDiscount(appliedVoucher);
    case "percentual":
      return applyPercentualDiscount({ subtotal, appliedVoucher });
    case "free shipping":
      return applyFreeShippingDiscount({ subtotal, shipping, appliedVoucher });
  }
}

//private functions

function isInRange(appliedVoucher: AppliedVoucher): boolean {
  return (
    appliedVoucher.amount!.greaterThanOrEqual(createMoney(0)) &&
    appliedVoucher.amount!.lessThanOrEqual(createMoney(100))
  );
}

export { AppliedVoucher };

export {
  createFixedVoucher,
  createPercentualVoucher,
  createFreeShippingVoucher,
  applyDiscount,
};
