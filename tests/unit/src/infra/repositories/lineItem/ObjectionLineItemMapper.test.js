"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cart_1 = require("../../../../../../src/domain/entities/Cart");
const LineItemModel_1 = require("../../../../../../src/infra/database/knex/models/LineItemModel");
const ObjectionLineItemMapper_1 = require("../../../../../../src/infra/repositories/lineItem/ObjectionLineItemMapper");
describe("Infra :: LineItem :: ObjectionLineItemMapper", () => {
    describe(".toEntity", () => {
        it("returns lineItem instance with lineItem model passed", () => {
            const lineItemModel = new LineItemModel_1.LineItemModel();
            const lineItemObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                productId: "2a20283a-2371-441f-af6e-899fe63def5c",
                unitPrice: 9.99,
                quantity: 10,
                ownerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                ownerType: "cart",
            };
            lineItemModel.$setJson(lineItemObject);
            const { productId, unitPrice, quantity } = lineItemObject;
            const expected = new Cart_1.LineItem(productId, unitPrice, quantity);
            expect(ObjectionLineItemMapper_1.ObjectionLineItemMapper.toEntity(lineItemModel)).toEqual(expected);
        });
    });
    describe(".toDatabase", () => {
        it("returns prepared object to be persisted", () => {
            const lineItemObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                productId: "2a20283a-2371-441f-af6e-899fe63def5c",
                unitPrice: 9.99,
                quantity: 10,
                ownerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                ownerType: "cart",
            };
            const { uuid, productId, unitPrice, quantity, ownerId, ownerType } = lineItemObject;
            const lineItem = new Cart_1.LineItem(productId, unitPrice, quantity);
            const props = { uuid, ownerId, ownerType };
            const expected = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                productId: "2a20283a-2371-441f-af6e-899fe63def5c",
                unitPrice: 9.99,
                quantity: 10,
                ownerId: "2a20283a-2371-441f-af6e-899fe63def5c",
                ownerType: "cart",
            };
            expect(ObjectionLineItemMapper_1.ObjectionLineItemMapper.toDatabase(lineItem, props)).toEqual(expected);
        });
    });
});
