"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const BuyerModel_1 = require("../../../../../../src/infra/database/knex/models/BuyerModel");
const ObjectionBuyerMapper_1 = require("../../../../../../src/infra/repositories/buyer/ObjectionBuyerMapper");
describe("Infra :: Buyer :: ObjectionBuyerMapper", () => {
    describe(".toEntity", () => {
        it("returns buyer instance with buyer model passed", () => {
            const buyerModel = new BuyerModel_1.BuyerModel();
            const buyerObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                name: "Matheus",
                birthDate: new Date("1999-08-02"),
                email: "matheus@gmail.com",
                postalCode: "142005-203",
                street: "Rua do teste",
                district: "Bairro do teste",
                city: "Piracicaba",
                country: "Brazil",
            };
            buyerModel.$setJson(buyerObject);
            const { uuid, name, birthDate, email, postalCode, street, district, city, country, } = buyerObject;
            const address = { postalCode, street, district, city, country };
            const expected = new entities_1.Buyer({
                id: uuid,
                name,
                birthDate,
                email,
                address,
            });
            expect(ObjectionBuyerMapper_1.ObjectionBuyerMapper.toEntity(buyerModel)).toEqual(expected);
        });
    });
    describe(".toDatabase", () => {
        it("returns prepared object to be persisted", () => {
            const buyerObject = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                name: "Matheus",
                birthDate: new Date("1999-08-02"),
                email: "matheus@gmail.com",
                postalCode: "142005-203",
                street: "Rua do teste",
                district: "Bairro do teste",
                city: "Piracicaba",
                country: "Brazil",
            };
            const { uuid, name, birthDate, email, postalCode, street, district, city, country, } = buyerObject;
            const address = { postalCode, street, district, city, country };
            const buyer = new entities_1.Buyer({
                id: uuid,
                name,
                birthDate,
                email,
                address,
            });
            const expected = {
                uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
                name: "Matheus",
                birthDate: new Date("1999-08-02"),
                email: "matheus@gmail.com",
                postalCode: "142005-203",
                street: "Rua do teste",
                district: "Bairro do teste",
                city: "Piracicaba",
                country: "Brazil",
            };
            expect(ObjectionBuyerMapper_1.ObjectionBuyerMapper.toDatabase(buyer)).toEqual(expected);
        });
    });
});
