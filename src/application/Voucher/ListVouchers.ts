import * as Voucher from "../../domain/entities/Voucher";
import { VoucherRepository } from "../../domain/repositories/VoucherRepository";

export default class ListVouchers {
  voucherRepository: VoucherRepository;

  constructor(voucherRepository: VoucherRepository) {
    this.voucherRepository = voucherRepository;
  }

  public async execute(): Promise<Array<Voucher.Voucher>> {
      return await this.voucherRepository.getAllVouchers();
  }
}
