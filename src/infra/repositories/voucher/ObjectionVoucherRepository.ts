import { v4 as uuidv4 } from "uuid";
import * as Voucher from "../../../domain/entities/Voucher";
import { VoucherRepository } from "../../../domain/repositories/VoucherRepository";
import { InfrastructureError } from "../../../lib/CustomError";
import { VoucherModel } from "../../database/knex/models/VoucherModel";
import { ObjectionVoucherMapper } from "./ObjectionVoucherMapper";

const ObjectionVoucherRepository: VoucherRepository = {
  getAllVouchers: function (): Promise<Voucher.Voucher[]> {
    return VoucherModel.query().then((data) =>
      data.map((d) => ObjectionVoucherMapper.toEntity(d))
    );
  },
  getVoucherById: function (id: string): Promise<Voucher.Voucher> {
    return VoucherModel.query()
      .findOne({
        uuid: id,
      })
      .then((data) => {
        if (data === undefined) {
          const notFoundError = new InfrastructureError({
            title: "Not Found Error",
            code: "NOTFOUND_ERROR",
            message: `Voucher with id ${id} can't be found.`,
          });
          return Promise.reject(notFoundError);
        }
        return ObjectionVoucherMapper.toEntity(data);
      });
  },
  getVoucherByCode: function (code: string): Promise<Voucher.Voucher> {
    return VoucherModel.query()
      .findOne({
        code,
      })
      .then((data) => {
        if (!data) throw new Error("Voucher Model is undefined.");
        return ObjectionVoucherMapper.toEntity(data);
      })
      .catch((error) => {
        const notFoundError = new InfrastructureError({
          title: "Not Found Error",
          code: "NOTFOUND_ERROR",
          message: `Couldn't find voucher with code: ${code} in database. Verify if you are passing the correct code.`,
          detail: error.message,
        });
        throw notFoundError;
      });
  },
  getNextId: function (): string {
    return uuidv4();
  },
};

export default ObjectionVoucherRepository;
