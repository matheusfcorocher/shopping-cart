import { DomainError } from "../../lib/CustomError";
import { Voucher } from "../entities";
import {
  AppliedVoucher,
  FixedVoucher,
  PercentualVoucher,
  ShippingVoucher,
} from "../valueObjects/AppliedVoucher";

interface AppliedVoucherFactory {
  fromVoucher(voucher: Voucher): AppliedVoucher;
}

const appliedFactory: AppliedVoucherFactory = {
  fromVoucher: function (voucher: Voucher): AppliedVoucher {
    const { id, type, amount, minValue } = voucher;
    switch (voucher.type) {
      case "percentual":
        return new PercentualVoucher({ voucherId: id, type, amount });
      case "fixed":
        return new FixedVoucher({ voucherId: id, type, amount });
      case "free shipping":
        if (minValue)
          return new ShippingVoucher({ voucherId: id, type, amount, minValue });
        throw new DomainError({
          title: "Internal Error",
          code: "INTERNAL_ERROR",
          message: "minValue field not found in free shipping voucher"
        });
      default:
        throw new DomainError({
          title: "Internal Error",
          code: "INTERNAL_ERROR",
          message: "Voucher type wasn't found"
        });
    }
  },
};

export { appliedFactory };
