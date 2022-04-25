import { DomainError } from "../../lib/errors/DomainError";
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
          return createFreeShippingVoucher({ voucherId: id, type, minValue });
        throw DomainError.create({
          name: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: "minValue field not found in free shipping voucher",
        });
      case "percentual":
        return createPercentualVoucher({ voucherId: id, type, amount });
      default:
        throw DomainError.create({
          name: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: "Voucher type wasn't found",
        });
    }
  },
};

export { appliedFactory };
