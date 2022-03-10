import { v4 as uuidv4 } from 'uuid';
import { Voucher } from "../../../domain/entities";
import { VoucherRepository } from "../../../domain/repositories/VoucherRepository";
import { VoucherModel } from "../../database/knex/models/VoucherModel";

class ObjectionVoucherRepository implements VoucherRepository {
  voucherModel: VoucherModel;

  constructor(voucherModel: VoucherModel) {
    this.voucherModel = voucherModel;
  }

  getAllVouchers(): Promise<Voucher[]> {
    return Promise.resolve(this.voucherModel);
  }
  getVoucherById(id: string): Promise<Voucher> {
    throw new Error("Method not implemented.");
  }
  getVoucherByCode(code: string): Promise<Voucher> {
    throw new Error("Method not implemented.");
  }
  getNextId(): string {
    return uuidv4();
  }
}

module.exports = ObjectionVoucherRepository;
