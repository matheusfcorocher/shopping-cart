import { Voucher } from "../../domain/entities";
import { VoucherRepository } from "../../domain/repositories/VoucherRepository";

export default class ListVouchers {
  productRepository: VoucherRepository;

  constructor(productRepository: VoucherRepository) {
    this.productRepository = productRepository;
  }

  public async execute(): Promise<Array<Voucher>> {
    try {
      return await this.productRepository.getAllVouchers();
    } catch (err) {
      throw err;
    }
  }
}
