"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionProductMapper = void 0;
const entities_1 = require("../../../domain/entities");
const ObjectionProductMapper = {
    toEntity(dataValues) {
        const { uuid, name, price, available } = dataValues;
        return new entities_1.Product({
            id: uuid,
            name,
            price,
            available,
        });
    },
    toDatabase(product) {
        const { id, name, price, available } = product;
        return {
            uuid: id,
            name,
            price,
            available,
        };
    },
};
exports.ObjectionProductMapper = ObjectionProductMapper;
