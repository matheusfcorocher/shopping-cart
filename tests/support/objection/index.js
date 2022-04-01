"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
function mockModel(model) {
    const query = objection_1.QueryBuilder.forClass(model);
    jest.spyOn(model, "query").mockReturnValue(query);
    return query;
}
exports.default = mockModel;
