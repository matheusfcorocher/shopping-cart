"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const Cart_1 = require("../../../../../../src/domain/entities/Cart");
const OrderModel_1 = require("../../../../../../src/infra/database/knex/models/OrderModel");
const ObjectionOrderMapper_1 = require("../../../../../../src/infra/repositories/order/ObjectionOrderMapper");
describe("Infra :: Order :: ObjectionOrderMapper", () => {
    describe(".toEntity", () => {
        it("returns order instance with passed props", () => {
            const orderModel = new OrderModel_1.OrderModel();
            const orderObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                discount: 50,
                paymentMethod: 'credit card'
            };
            orderModel.$setJson(orderObject);
            const { uuid, buyerId, discount, paymentMethod } = orderModel;
            const lineItems = [new Cart_1.LineItem("2a20283a-2371-441f-af6e-899fe63def5c", 19.99, 5),];
            const expected = new entities_1.Order({ id: uuid, buyerId, discount, paymentMethod, lineItems });
            expect(ObjectionOrderMapper_1.ObjectionOrderMapper.toEntity(orderModel, lineItems)).toEqual(expected);
        });
    });
    describe(".toDatabase", () => {
        it("returns prepared object to be persisted", () => {
            const lineItems = [new Cart_1.LineItem("2a20283a-2371-441f-af6e-899fe63def5c", 19.99, 5),];
            const order = new entities_1.Order({
                id: "2a20283a-2371-441f-af6e-899fe63def5c",
                buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                lineItems,
                discount: 50,
                paymentMethod: 'credit card'
            });
            const expected = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                discount: 50,
                paymentMethod: 'credit card'
            };
            expect(ObjectionOrderMapper_1.ObjectionOrderMapper.toDatabase(order)).toEqual(expected);
        });
    });
});
