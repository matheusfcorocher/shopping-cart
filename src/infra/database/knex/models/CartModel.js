"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const objection_1 = require("objection");
class CartModel extends objection_1.Model {
    static get relationMappings() {
        const { BuyerModel } = require("./BuyerModel");
        const { LineItemModel } = require("./LineItemModel");
        const { VoucherModel } = require("./VoucherModel");
        return {
            buyer: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: BuyerModel,
                join: {
                    from: "carts.buyerId",
                    to: "buyers.uuid",
                },
            },
            voucher: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: VoucherModel,
                join: {
                    from: "carts.voucherId",
                    to: "vouchers.uuid",
                },
            },
            lineItems: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: LineItemModel,
                filter(builder) {
                    builder.where('ownerType', 'cart');
                },
                beforeInsert(model) {
                    model.ownerType = 'cart';
                },
                join: {
                    from: 'carts.uuid',
                    to: 'lineItems.ownerId'
                }
            }
        };
    }
}
exports.CartModel = CartModel;
CartModel.tableName = "carts";
