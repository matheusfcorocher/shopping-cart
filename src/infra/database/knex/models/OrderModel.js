"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const objection_1 = require("objection");
class OrderModel extends objection_1.Model {
    static get relationMappings() {
        const { BuyerModel } = require("./BuyerModel");
        const { LineItemModel } = require("./LineItemModel");
        return {
            buyer: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: BuyerModel,
                join: {
                    from: "orders.buyerId",
                    to: "buyers.uuid",
                },
            },
            lineItems: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: LineItemModel,
                filter(builder) {
                    builder.where('ownerType', 'order');
                },
                beforeInsert(model) {
                    model.ownerType = 'order';
                },
                join: {
                    from: 'orders.uuid',
                    to: 'lineItems.ownerId'
                }
            }
        };
    }
}
exports.OrderModel = OrderModel;
OrderModel.tableName = "orders";
