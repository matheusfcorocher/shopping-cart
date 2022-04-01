"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VoucherModel_1 = require("../../../../src/infra/database/knex/models/VoucherModel");
const VoucherModelFactory = {
    createList: function (list) {
        try {
            return Promise.all(list.map((d) => this.create(d)));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    },
    create: function (data) {
        return Promise.resolve(VoucherModel_1.VoucherModel.query().insert(data));
    },
};
exports.default = VoucherModelFactory;
