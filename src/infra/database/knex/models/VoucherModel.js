"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherModel = void 0;
const objection_1 = require("objection");
class VoucherModel extends objection_1.Model {
    static get relationMappings() {
        const { CartModel } = require("./CartModel");
        return {
            cart: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: CartModel,
                join: {
                    from: "vouchers.uuid",
                    to: "carts.voucherId",
                },
            },
        };
    }
}
exports.VoucherModel = VoucherModel;
VoucherModel.tableName = "vouchers";
