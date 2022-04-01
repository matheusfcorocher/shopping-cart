"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const BuyerModel_1 = require("../../database/knex/models/BuyerModel");
const ObjectionBuyerMapper_1 = require("./ObjectionBuyerMapper");
class ObjectionBuyerRepository {
    getAllBuyers() {
        return BuyerModel_1.BuyerModel.query().then((data) => data.map((d) => ObjectionBuyerMapper_1.ObjectionBuyerMapper.toEntity(d)));
    }
    getBuyerById(id) {
        return this.getBuyerModelById(id).then((data) => ObjectionBuyerMapper_1.ObjectionBuyerMapper.toEntity(data));
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    async store(buyer) {
        const hasBuyer = await this.hasBuyer(buyer.id);
        if (hasBuyer) {
            const validationError = new Error("Validation Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            validationError.message = `Buyer with id ${buyer.id} already exists.`;
            return Promise.reject(validationError);
        }
        return BuyerModel_1.BuyerModel.query()
            .insertAndFetch(ObjectionBuyerMapper_1.ObjectionBuyerMapper.toDatabase(buyer))
            .then((data) => ObjectionBuyerMapper_1.ObjectionBuyerMapper.toEntity(data));
    }
    getBuyerModelById(id) {
        return BuyerModel_1.BuyerModel.query()
            .findOne({
            uuid: id,
        })
            .then((data) => {
            if (data === undefined) {
                const notFoundError = new Error("Not Found Error");
                //   notFoundError.CODE = "NOTFOUND_ERROR";
                notFoundError.message = `Buyer with id ${id} can't be found.`;
                return Promise.reject(notFoundError);
            }
            return data;
        });
    }
    hasBuyer(id) {
        return BuyerModel_1.BuyerModel.query()
            .findOne({
            uuid: id,
        })
            .then((data) => {
            if (data === undefined) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        });
    }
}
exports.default = ObjectionBuyerRepository;
