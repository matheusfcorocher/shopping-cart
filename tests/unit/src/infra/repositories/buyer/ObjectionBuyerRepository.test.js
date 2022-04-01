"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const ObjectionBuyerRepository_1 = __importDefault(require("../../../../../../src/infra/repositories/buyer/ObjectionBuyerRepository"));
const BuyerModelFactory_1 = __importDefault(require("../../../../../support/factories/models/BuyerModelFactory"));
const { setupIntegrationTest } = require("../../../../../support/setup");
const buyerRepository = new ObjectionBuyerRepository_1.default();
describe("Infra :: Buyer :: ObjectionBuyerRepository", () => {
    setupIntegrationTest();
    beforeEach(async () => {
        await BuyerModelFactory_1.default.createList([
            {
                uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                name: "Matheus",
                birthDate: new Date(1999, 8, 2),
                email: "matheus@gmail.com",
                postalCode: "142005-203",
                street: "Rua do teste",
                district: "Bairro do teste",
                city: "Piracicaba",
                country: "Brazil",
            },
            {
                uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                name: "Matheus",
                birthDate: new Date(1999, 8, 2),
                email: "matheus@gmail.com",
                postalCode: "142005-203",
                street: "Rua do teste",
                district: "Bairro do teste",
                city: "Piracicaba",
                country: "Brazil",
            },
            {
                uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                name: "Matheus",
                birthDate: new Date(1999, 8, 2),
                email: "matheus@gmail.com",
                postalCode: "142005-203",
                street: "Rua do teste",
                district: "Bairro do teste",
                city: "Piracicaba",
                country: "Brazil",
            },
        ]);
    });
    describe("#getAllBuyers", () => {
        describe("When method is called", () => {
            describe("result is a array instance of buyers", () => {
                it("returns correct result", async () => {
                    const buyers = await buyerRepository.getAllBuyers();
                    expect(buyers[0]).toBeInstanceOf(entities_1.Buyer);
                });
            });
            describe("result has correct length", () => {
                it("returns correct result", async () => {
                    const buyers = await buyerRepository.getAllBuyers();
                    expect(buyers.length).toBe(3);
                });
            });
            describe("result returns correct array", () => {
                it("returns correct result", async () => {
                    const buyers = await buyerRepository.getAllBuyers();
                    const expected = [
                        new entities_1.Buyer({
                            id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                            name: "Matheus",
                            birthDate: new Date(1999, 8, 2),
                            email: "matheus@gmail.com",
                            address: {
                                postalCode: "142005-203",
                                street: "Rua do teste",
                                district: "Bairro do teste",
                                city: "Piracicaba",
                                country: "Brazil",
                            },
                        }),
                        new entities_1.Buyer({
                            id: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                            name: "Matheus",
                            birthDate: new Date(1999, 8, 2),
                            email: "matheus@gmail.com",
                            address: {
                                postalCode: "142005-203",
                                street: "Rua do teste",
                                district: "Bairro do teste",
                                city: "Piracicaba",
                                country: "Brazil",
                            },
                        }),
                        new entities_1.Buyer({
                            id: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                            name: "Matheus",
                            birthDate: new Date(1999, 8, 2),
                            email: "matheus@gmail.com",
                            address: {
                                postalCode: "142005-203",
                                street: "Rua do teste",
                                district: "Bairro do teste",
                                city: "Piracicaba",
                                country: "Brazil",
                            },
                        }),
                    ];
                    expect(buyers).toEqual(expect.arrayContaining(expected));
                });
            });
        });
        describe("When service is unavailable", () => {
            it("returns error", async () => {
                const error = new Error("Service Unavailable");
                buyerRepository.getAllBuyers = () => Promise.reject(error);
                await expect(() => buyerRepository.getAllBuyers()).rejects.toThrow(error);
            });
        });
    });
    describe("#getBuyerById", () => {
        describe("result is a buyer instance", () => {
            it("returns the correct result", async () => {
                const buyer = await buyerRepository.getBuyerById("7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf");
                const address = {
                    postalCode: "142005-203",
                    street: "Rua do teste",
                    district: "Bairro do teste",
                    city: "Piracicaba",
                    country: "Brazil",
                };
                const expected = new entities_1.Buyer({
                    id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    name: "Matheus",
                    birthDate: new Date(1999, 8, 2),
                    email: "matheus@gmail.com",
                    address,
                });
                expect(buyer).toEqual(expected);
            });
        });
        describe("When doesn't find a buyer by id", () => {
            it("returns error", async () => {
                const id = "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd";
                const notFoundError = new Error("Not Found Error");
                notFoundError.message = `Buyer with id ${id} can't be found.`;
                await expect(() => buyerRepository.getBuyerById(id)).rejects.toThrow(notFoundError);
            });
        });
    });
    describe("#store", () => {
        describe("result is a buyer instance", () => {
            it("returns the correct result", async () => {
                const buyer = new entities_1.Buyer({
                    id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                    name: "Matheus",
                    birthDate: new Date(1999, 8, 2),
                    email: "matheus@gmail.com",
                    address: {
                        postalCode: "142005-203",
                        street: "Rua do teste",
                        district: "Bairro do teste",
                        city: "Piracicaba",
                        country: "Brazil",
                    },
                });
                const expected = await buyerRepository.store(buyer);
                expect(buyer).toEqual(expected);
            });
        });
        describe("When a buyer with the same uuid already exists", () => {
            it("returns error", async () => {
                const buyer = new entities_1.Buyer({
                    id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    name: "Matheus",
                    birthDate: new Date("1999-08-02"),
                    email: "matheus@gmail.com",
                    address: {
                        postalCode: "142005-203",
                        street: "Rua do teste",
                        district: "Bairro do teste",
                        city: "Piracicaba",
                        country: "Brazil",
                    },
                });
                const validationError = new Error("Validation Error");
                validationError.message = `Buyer with id ${buyer.id} already exists.`;
                await expect(() => buyerRepository.store(buyer)).rejects.toThrow(validationError);
            });
        });
    });
    describe("#getNextId", () => {
        it("returns a uuid", () => {
            const uuid = buyerRepository.getNextId();
            const expected = [
                expect.stringMatching(/^\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/),
            ];
            expect([uuid]).toEqual(expect.arrayContaining(expected));
        });
    });
});
