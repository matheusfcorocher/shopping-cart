import { v4 as uuidv4 } from "uuid";
import { Voucher } from "../../../domain/entities";
import { VoucherRepository } from "../../../domain/repositories/VoucherRepository";
import { VoucherModel } from "../../database/knex/models/index";
import { ObjectionVoucherMapper } from "./ObjectionVoucherMapper";

class ObjectionVoucherRepository implements VoucherRepository {
 
  public getAllVouchers(): Promise<Voucher[]> {
    return Promise.resolve(VoucherModel.query()).then((data) =>
      data.map((d) => ObjectionVoucherMapper.toEntity(d))
    );
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

export default ObjectionVoucherRepository;