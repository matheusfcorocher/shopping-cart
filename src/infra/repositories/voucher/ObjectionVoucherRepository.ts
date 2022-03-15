import { v4 as uuidv4 } from "uuid";
import { Voucher } from "../../../domain/entities";
import { VoucherRepository } from "../../../domain/repositories/VoucherRepository";
import { VoucherModel } from "../../database/knex/models/index";
import { ObjectionVoucherMapper } from "./ObjectionVoucherMapper";

class ObjectionVoucherRepository implements VoucherRepository {
 
  public getAllVouchers(): Promise<Voucher[]> {
    return VoucherModel.query().then((data) =>
      data.map((d) => ObjectionVoucherMapper.toEntity(d))
    );
  }
  getVoucherById(id: string): Promise<Voucher> {
    return VoucherModel.query().findOne({
      uuid:id
    }).then((data) => {
      if(data ===undefined) {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Voucher with id ${id} can't be found.`;
        return Promise.reject(notFoundError);
      }
      return ObjectionVoucherMapper.toEntity(data)
    })
  }
  getVoucherByCode(code: string): Promise<Voucher> {
    throw new Error("Method not implemented.");
  }
  getNextId(): string {
    return uuidv4();
  }
}

export default ObjectionVoucherRepository;