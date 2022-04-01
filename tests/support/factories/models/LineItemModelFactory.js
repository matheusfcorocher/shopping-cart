"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LineItemModel_1 = require("../../../../src/infra/database/knex/models/LineItemModel");
const LineItemModelFactory = {
    createList: function (list) {
        try {
            return Promise.all(list.map((d) => this.create(d)));
        }
        catch (error) {
            throw error;
        }
    },
    create: function (data) {
        return Promise.resolve(LineItemModel_1.LineItemModel.query().insert(data));
    },
};
exports.default = LineItemModelFactory;
