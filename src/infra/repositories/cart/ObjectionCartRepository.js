"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const objection_1 = require("objection");
const entities_1 = require("../../../domain/entities");
const AppliedVoucherFactory_1 = require("../../../domain/factories/AppliedVoucherFactory");
const ObjectionLineItemMapper_1 = require("../lineItem/ObjectionLineItemMapper");
const ObjectionCartMapper_1 = require("./ObjectionCartMapper");
const CartModel_1 = require("../../database/knex/models/CartModel");
const LineItemModel_1 = require("../../database/knex/models/LineItemModel");
const CustomError_1 = require("../../../lib/CustomError");
class ObjectionCartRepository {
    //public methods
    async delete(cart) {
        return (0, objection_1.transaction)(CartModel_1.CartModel, async (BoundCartModel) => {
            const { buyerId, id, lineItems } = cart;
            const productIds = lineItems.map((l) => l.productId);
            const boundCartModel = await this.getCartModelById(id, BoundCartModel);
            await this.deleteLineItems(productIds, boundCartModel);
            return boundCartModel
                .$query()
                .delete()
                .then(() => "Cart was deleted successfully.")
                .catch(() => {
                const notFoundError = new Error("Not Found Error");
                //   notFoundError.CODE = "NOTFOUND_ERROR";
                notFoundError.message = `Cart with id ${id} and buyerId ${buyerId} can't be found.`;
                return Promise.reject(notFoundError);
            });
        });
    }
    getAllCarts() {
        return CartModel_1.CartModel.query().then((data) => Promise.all(data.map((d) => {
            return this.transformCartModelToCart(d);
        })));
    }
    getCartById(id) {
        return CartModel_1.CartModel.query()
            .findOne({
            uuid: id,
        })
            .then((data) => {
            return this.transformCartModelToCart(data);
        })
            .catch((err) => {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `Cart with id ${id} can't be found.`;
            return Promise.reject(notFoundError);
        });
    }
    getCartByBuyerId(buyerId) {
        return CartModel_1.CartModel.query()
            .findOne({
            buyerId,
        })
            .then((data) => {
            return this.transformCartModelToCart(data);
        })
            .catch((err) => {
            const notFoundError = new CustomError_1.DbError({
                title: "Not Found Error",
                status: 404,
                detail: `Couldn't find cart with buyerId: ${buyerId} in database. Verify if you are passing the correct buyerId.`,
                stack: err.stack,
            });
            return Promise.reject(notFoundError);
        });
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    async update(cart) {
        return (0, objection_1.transaction)(CartModel_1.CartModel, async (BoundCartModel) => {
            const { id, lineItems } = cart;
            const boundCartModel = await this.getCartModelById(id, BoundCartModel);
            const promises = lineItems.map(async (lineItem) => {
                const hasLineItem = await this.hasLineItem(lineItem.productId, boundCartModel);
                if (hasLineItem && lineItem.quantity == 0) {
                    return this.deleteLineItem(lineItem.productId, boundCartModel);
                }
                else if (hasLineItem && lineItem.quantity > 0) {
                    const { unitPrice, quantity, productId } = lineItem;
                    return this.updateLineItem({
                        unitPrice,
                        quantity,
                        productId,
                    }, boundCartModel);
                }
                else
                    return this.storeLineItem(lineItem, boundCartModel);
            });
            await Promise.all(promises);
            const data = ObjectionCartMapper_1.ObjectionCartMapper.toDatabase(cart);
            return boundCartModel
                .$query()
                .patchAndFetch(data)
                .then((result) => {
                return this.transformCartModelToCart(result);
            });
        });
    }
    //private methods
    getCartModelById(id, cartModel = CartModel_1.CartModel) {
        return cartModel
            .query()
            .findOne({
            uuid: id,
        })
            .then((data) => {
            return data;
        })
            .catch((err) => {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `Cart with id ${id} can't be found.`;
            return Promise.reject(notFoundError);
        });
    }
    async deleteLineItem(productId, cartModel) {
        return cartModel
            .$relatedQuery("lineItems")
            .where({ productId })
            .delete()
            .then(() => Promise.resolve("LineItem was deleted successfully."))
            .catch(() => {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `LineItem with productId ${productId} can't be found.`;
            return Promise.reject(notFoundError);
        });
    }
    async deleteLineItems(productIds, cartModel) {
        return cartModel
            .$relatedQuery("lineItems")
            .whereIn("productId", productIds)
            .delete()
            .then(() => Promise.resolve("LineItems was deleted successfully."))
            .catch(() => {
            const notFoundError = new Error("Not Found Error");
            //   notFoundError.CODE = "NOTFOUND_ERROR";
            notFoundError.message = `LineItems can't be found.`;
            return Promise.reject(notFoundError);
        });
    }
    getAllLineItemsByOwner(owner) {
        return this.getAllLineItemsModelsByOwner(owner).then((data) => data.map((d) => ObjectionLineItemMapper_1.ObjectionLineItemMapper.toEntity(d)));
    }
    async transformCartModelToCart(cart) {
        const owner = {
            ownerId: cart.uuid,
            ownerType: "cart",
        };
        const lineItems = await this.getAllLineItemsByOwner(owner);
        const appliedVoucher = this.getAppliedVoucher(cart);
        const additionalProps = {
            lineItems,
            appliedVoucher,
        };
        return ObjectionCartMapper_1.ObjectionCartMapper.toEntity(cart, additionalProps);
    }
    async updateLineItem(data, cartModel) {
        return cartModel
            .$relatedQuery("lineItems")
            .where({ productId: data.productId })
            .update(data)
            .then(() => `LineItem was updated`);
    }
    //private methods - dead ends
    getAppliedVoucher(cartModel) {
        const { voucherId, type, amount, minValue } = cartModel;
        if (voucherId && type && amount) {
            const voucherType = type;
            const voucher = new entities_1.Voucher({
                id: voucherId,
                code: "null",
                type: voucherType,
                amount,
                minValue,
            });
            return AppliedVoucherFactory_1.appliedFactory.fromVoucher(voucher);
        }
        return undefined;
    }
    getLineItemsModelByOwnerAndProductId(owner, productId, lineItemModel) {
        const { ownerId, ownerType } = owner;
        return lineItemModel
            .query()
            .findOne({
            productId,
            ownerId,
            ownerType,
        })
            .then((data) => {
            if (data === undefined) {
                const notFoundError = new Error("Not Found Error");
                //   notFoundError.CODE = "NOTFOUND_ERROR";
                notFoundError.message = `Line with ownerId ${ownerId} and productId ${productId} can't be found for ${ownerType}.`;
                return Promise.reject(notFoundError);
            }
            return data;
        });
    }
    getAllLineItemsModelsByOwner(owner) {
        const { ownerId, ownerType } = owner;
        return LineItemModel_1.LineItemModel.query()
            .where({
            ownerId,
            ownerType,
        })
            .then((data) => {
            if (data === undefined) {
                const notFoundError = new Error("Not Found Error");
                //   notFoundError.CODE = "NOTFOUND_ERROR";
                notFoundError.message = `Line with ownerId ${ownerId} can't be found for ${ownerType}.`;
                return Promise.reject(notFoundError);
            }
            return data;
        });
    }
    hasLineItem(productId, cartModel) {
        return cartModel
            .$relatedQuery("lineItems")
            .findOne({
            productId,
        })
            .then((d) => (d ? true : false))
            .catch(() => false);
    }
    storeLineItem(lineItem, cartModel) {
        const uuid = this.getNextId();
        const { productId, unitPrice, quantity } = lineItem;
        const data = {
            uuid,
            productId,
            unitPrice,
            quantity,
        };
        return cartModel
            .$relatedQuery("lineItems")
            .insert(data)
            .then(() => "LineItem was created with success!");
    }
}
exports.default = ObjectionCartRepository;
