"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const VoucherModel_1 = require("../../database/knex/models/VoucherModel");
const ObjectionVoucherMapper_1 = require("./ObjectionVoucherMapper");
class ObjectionVoucherRepository {
    getAllVouchers() {
        return VoucherModel_1.VoucherModel.query().then((data) => data.map((d) => ObjectionVoucherMapper_1.ObjectionVoucherMapper.toEntity(d)));
    }
    getVoucherById(id) {
        return VoucherModel_1.VoucherModel.query().findOne({
            uuid: id
        }).then((data) => {
            if (data === undefined) {
                const notFoundError = new Error("Not Found Error");
                //   notFoundError.CODE = "NOTFOUND_ERROR";
                notFoundError.message = `Voucher with id ${id} can't be found.`;
                return Promise.reject(notFoundError);
            }
            return ObjectionVoucherMapper_1.ObjectionVoucherMapper.toEntity(data);
        });
    }
    getVoucherByCode(code) {
        return VoucherModel_1.VoucherModel.query().findOne({
            code
        }).then((data) => {
            if (data === undefined) {
                const notFoundError = new Error("Not Found Error");
                //   notFoundError.CODE = "NOTFOUND_ERROR";
                notFoundError.message = `Voucher with code ${code} can't be found.`;
                return Promise.reject(notFoundError);
            }
            return ObjectionVoucherMapper_1.ObjectionVoucherMapper.toEntity(data);
        });
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
}
exports.default = ObjectionVoucherRepository;
