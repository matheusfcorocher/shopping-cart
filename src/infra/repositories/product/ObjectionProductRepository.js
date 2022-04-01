"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const CustomError_1 = require("../../../lib/CustomError");
const ProductModel_1 = require("../../database/knex/models/ProductModel");
const ObjectionProductMapper_1 = require("./ObjectionProductMapper");
class ObjectionProductRepository {
    getAllProducts() {
        return ProductModel_1.ProductModel.query().then((data) => data.map((d) => ObjectionProductMapper_1.ObjectionProductMapper.toEntity(d)));
    }
    getProductById(id) {
        return this.getProductModelById(id).then((data) => ObjectionProductMapper_1.ObjectionProductMapper.toEntity(data));
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    async update(id, data) {
        const product = await this.getProductModelById(id);
        return product
            .$query()
            .patchAndFetch(data)
            .then((result) => ObjectionProductMapper_1.ObjectionProductMapper.toEntity(result));
    }
    getProductModelById(id) {
        return ProductModel_1.ProductModel.query()
            .findOne({
            uuid: id,
        })
            .then((data) => {
            return data;
        })
            .catch((err) => {
            const notFoundError = new CustomError_1.DbError({
                title: "Not Found Error",
                status: 404,
                detail: `Couldn't find product with id: ${id} in database. Verify if you are passing the correct productId.`,
                stack: err.stack,
            });
            return Promise.reject(notFoundError);
        });
    }
}
exports.default = ObjectionProductRepository;
