"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectionBuyerMapper = void 0;
const entities_1 = require("../../../domain/entities");
const ObjectionBuyerMapper = {
    toEntity(dataValues) {
        const { uuid, name, birthDate, email, postalCode, street, district, city, country, } = dataValues;
        const address = {
            postalCode,
            street,
            district,
            city,
            country,
        };
        return new entities_1.Buyer({
            id: uuid,
            name,
            birthDate,
            email,
            address,
        });
    },
    toDatabase(buyer) {
        const { id, name, birthDate, email, address } = buyer;
        const { postalCode, street, district, city, country } = address;
        return {
            uuid: id,
            name,
            birthDate,
            email,
            postalCode,
            street,
            district,
            city,
            country,
        };
    },
};
exports.ObjectionBuyerMapper = ObjectionBuyerMapper;
