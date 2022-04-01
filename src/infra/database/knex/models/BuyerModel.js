"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerModel = void 0;
const objection_1 = require("objection");
const knex_1 = __importDefault(require("../knex"));
//only need one Model.knex receiving knexInstance to work Objection Model
objection_1.Model.knex(knex_1.default);
class BuyerModel extends objection_1.Model {
    static get relationMappings() {
        const { CartModel } = require("./CartModel");
        return {
            owner: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: CartModel,
                join: {
                    from: "buyers.uuid",
                    to: "carts.buyerId",
                },
            },
        };
    }
}
exports.BuyerModel = BuyerModel;
BuyerModel.tableName = "buyers";
