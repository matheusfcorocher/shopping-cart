"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const objection_1 = require("objection");
class ProductModel extends objection_1.Model {
    static get relationMappings() {
        const { LineItemModel } = require("./LineItemModel");
        return {
            lineItem: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: LineItemModel,
                join: {
                    from: "products.uuid",
                    to: "lineItems.productId",
                },
            },
        };
    }
}
exports.ProductModel = ProductModel;
ProductModel.tableName = "products";
