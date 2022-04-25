import * as Voucher from "../../domain/entities/Voucher";
import { VoucherRepository } from "../../domain/repositories/VoucherRepository";

type makeListVouchersProps = {
  voucherRepository: VoucherRepository;
};

function makeListVouchers({
  voucherRepository,
}: makeListVouchersProps) {
  async function listVouchers(): Promise<Array<Voucher.Voucher>> {
    return voucherRepository.getAllVouchers();
  }

  return listVouchers;
}

export { makeListVouchersProps };

export { makeListVouchers };

