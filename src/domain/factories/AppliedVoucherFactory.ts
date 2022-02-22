import { Cart, Voucher } from "../entities";
import {
  AppliedVoucher,
  FixedVoucher,
  PercentualVoucher,
  ShippingVoucher,
} from "../valueObjects/AppliedVoucher";

interface AppliedVoucherFactory {
    fromVoucher(voucher: Voucher, cart: Cart): AppliedVoucher;
}

const appliedFactory: AppliedVoucherFactory = {
  fromVoucher: function (voucher: Voucher): AppliedVoucher {
      const {id, type, amount, minValue} = voucher;
    switch (voucher.type) {
      case "percentual":
        return new PercentualVoucher({voucherId: id, type, amount});
      case "fixed":
        return new FixedVoucher({voucherId: id, type, amount});
      case "free shipping":
        return new ShippingVoucher({voucherId: id, type, amount, minValue});
      default:
        throw new Error("Voucher type wasn't found");
    }
  },
};

export { appliedFactory };