"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItemModel = void 0;
const objection_1 = require("objection");
class LineItemModel extends objection_1.Model {
    static get relationMappings() {
        const { ProductModel } = require("./ProductModel");
        return {
            product: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: ProductModel,
                join: {
                    from: "lineItems.productId",
                    to: "products.uuid",
                },
            },
        };
    }
}
exports.LineItemModel = LineItemModel;
LineItemModel.tableName = "lineItems";
