import { DomainError } from "../../lib/CustomError";
import { Voucher } from "../entities/Voucher";
import {
  AppliedVoucher,
  createFixedVoucher,
  createFreeShippingVoucher,
  createPercentualVoucher,
} from "../valueObjects/AppliedVoucher";

interface AppliedVoucherFactory {
  fromVoucher(voucher: Voucher): AppliedVoucher;
}

const appliedFactory: AppliedVoucherFactory = {
  fromVoucher: function (voucher: Voucher): AppliedVoucher {
    const { id, type, amount, minValue } = voucher;
    switch (voucher.type) {
      case "fixed":
        return createFixedVoucher({ voucherId: id, type, amount });
      case "free shipping":
        if (minValue)
          return createFreeShippingVoucher({ voucherId: id, type, amount, minValue });
        throw new DomainError({
          title: "Internal Error",
          code: "INTERNAL_ERROR",
          message: "minValue field not found in free shipping voucher",
        });
      case "percentual":
        return createPercentualVoucher({ voucherId: id, type, amount });
      default:
        throw new DomainError({
          title: "Internal Error",
          code: "INTERNAL_ERROR",
          message: "Voucher type wasn't found",
        });
    }
  },
};

export { appliedFactory };
