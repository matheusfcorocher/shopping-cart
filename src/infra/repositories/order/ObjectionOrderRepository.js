"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const uuid_1 = require("uuid");
const LineItemModel_1 = require("../../database/knex/models/LineItemModel");
const OrderModel_1 = require("../../database/knex/models/OrderModel");
const ObjectionLineItemMapper_1 = require("../lineItem/ObjectionLineItemMapper");
const ObjectionOrderMapper_1 = require("./ObjectionOrderMapper");
class ObjectionOrderRepository {
    getAllOrders() {
        return OrderModel_1.OrderModel.query().then((data) => Promise.all(data.map((d) => {
            return this.transformOrderModelToOrder(d);
        })));
    }
    store(order) {
        return (0, objection_1.transaction)(OrderModel_1.OrderModel, async (BoundOrderModel) => {
            const { lineItems } = order;
            const data = ObjectionOrderMapper_1.ObjectionOrderMapper.toDatabase(order);
            const boundOrderModel = await BoundOrderModel
                .query()
                .insertAndFetch(data);
            const promises = lineItems.map(async (lineItem) => {
                return this.storeLineItem(lineItem, boundOrderModel);
            });
            await Promise.all(promises);
            return 'Order was created successfully!';
        });
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    async transformOrderModelToOrder(order) {
        const owner = {
            ownerId: order.uuid,
            ownerType: "order",
        };
        const lineItems = await this.getAllLineItemsByOwner(owner);
        return ObjectionOrderMapper_1.ObjectionOrderMapper.toEntity(order, lineItems);
    }
    getAllLineItemsByOwner(owner) {
        return this.getAllLineItemsModelsByOwner(owner).then((data) => data.map((d) => ObjectionLineItemMapper_1.ObjectionLineItemMapper.toEntity(d)));
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
    storeLineItem(lineItem, orderModel) {
        const uuid = this.getNextId();
        const { productId, unitPrice, quantity } = lineItem;
        const data = {
            uuid,
            productId,
            unitPrice,
            quantity,
        };
        return orderModel
            .$relatedQuery("lineItems")
            .insert(data)
            .then(() => "LineItem was created with success!");
    }
}
exports.default = ObjectionOrderRepository;
