"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../../app");
const BuyerModelFactory_1 = __importDefault(require("../../../support/factories/models/BuyerModelFactory"));
const CartModelFactory_1 = __importDefault(require("../../../support/factories/models/CartModelFactory"));
const LineItemModelFactory_1 = __importDefault(require("../../../support/factories/models/LineItemModelFactory"));
const ProductModelFactory_1 = __importDefault(require("../../../support/factories/models/ProductModelFactory"));
const VoucherModelFactory_1 = __importDefault(require("../../../support/factories/models/VoucherModelFactory"));
const { setupIntegrationTest } = require("../../../support/setup");
describe("Interfaces :: Cart :: Routes :: AddLineItem", () => {
    describe("API :: POST /api/carts/addLineItem", () => {
        setupIntegrationTest();
        beforeEach(async () => {
            await ProductModelFactory_1.default.createList([
                {
                    uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    name: "Gaming Keyboard",
                    price: 79.99,
                    available: 30,
                },
                {
                    uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                    name: "Gaming Chair",
                    price: 299.99,
                    available: 30,
                },
                {
                    uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                    name: "Gaming Mouse",
                    price: 39.99,
                    available: 30,
                },
            ]);
            await LineItemModelFactory_1.default.createList([
                {
                    uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    unitPrice: 79.99,
                    quantity: 2,
                    ownerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    ownerType: "cart",
                },
                {
                    uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                    productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                    unitPrice: 299.99,
                    quantity: 2,
                    ownerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                    ownerType: "cart",
                },
                {
                    uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                    productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                    unitPrice: 39.99,
                    quantity: 2,
                    ownerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                    ownerType: "cart",
                },
            ]);
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
                    uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                    name: "Matheus",
                    birthDate: new Date(1999, 8, 2),
                    email: "matheus2@gmail.com",
                    postalCode: "142005-201",
                    street: "Rua do teste",
                    district: "Bairro do teste",
                    city: "Piracicaba",
                    country: "Brazil",
                },
                {
                    uuid: "45f815f4-a7fd-4e80-89eb-45113d9537df",
                    name: "Matheus",
                    birthDate: new Date(1999, 8, 2),
                    email: "matheus3@gmail.com",
                    postalCode: "142005-201",
                    street: "Rua do teste",
                    district: "Bairro do teste",
                    city: "Piracicaba",
                    country: "Brazil",
                },
                {
                    uuid: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                    name: "Matheus",
                    birthDate: new Date(1999, 8, 2),
                    email: "matheus4@gmail.com",
                    postalCode: "142005-201",
                    street: "Rua do teste",
                    district: "Bairro do teste",
                    city: "Piracicaba",
                    country: "Brazil",
                },
            ]);
            await VoucherModelFactory_1.default.createList([
                {
                    uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    code: "TEST1",
                    type: "percentual",
                    amount: 40,
                },
                {
                    uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                    code: "TEST2",
                    type: "fixed",
                    amount: 40,
                },
                {
                    uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                    code: "TEST3",
                    type: "free shipping",
                    amount: 2,
                    minValue: 50,
                },
            ]);
            await CartModelFactory_1.default.createList([
                {
                    uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    type: "fixed",
                    amount: 50,
                },
                {
                    uuid: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                    buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                },
                {
                    uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                    buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                },
                {
                    uuid: "45f815f4-a7fd-4e80-89eb-45113d9537df",
                    buyerId: "45f815f4-a7fd-4e80-89eb-45113d9537df",
                    voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    type: "fixed",
                    amount: 50,
                },
            ]);
        });
        describe("When cart doesn't have any line item", () => {
            describe("and cart doesnt have voucher", () => {
                it("returns correct cart", async () => {
                    const data = {
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    };
                    const response = await (0, supertest_1.default)(app_1.app.server)
                        .post("/api/carts/addLineItem")
                        .send(data)
                        .set("Content-type", "application/json")
                        .expect(200);
                    const expected = {
                        id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcd",
                        lineItems: [
                            {
                                productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                                unitPrice: 79.99,
                                quantity: 1,
                            },
                        ],
                        appliedVoucher: null,
                    };
                    expect(response.body).toEqual(expected);
                });
            });
        });
        describe("and cart has voucher", () => {
            it("returns correct cart", async () => {
                const data = {
                    buyerId: "45f815f4-a7fd-4e80-89eb-45113d9537df",
                    productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                };
                const response = await (0, supertest_1.default)(app_1.app.server)
                    .post("/api/carts/addLineItem")
                    .send(data)
                    .set("Content-type", "application/json")
                    .expect(200);
                const expected = {
                    id: "45f815f4-a7fd-4e80-89eb-45113d9537df",
                    buyerId: "45f815f4-a7fd-4e80-89eb-45113d9537df",
                    lineItems: [
                        {
                            productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                            unitPrice: 79.99,
                            quantity: 1,
                        },
                    ],
                    appliedVoucher: {
                        voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        type: "fixed",
                        amount: 50,
                    },
                };
                expect(response.body).toEqual(expected);
            });
        });
        describe("When cart has line items", () => {
            describe("and cart doesnt have voucher", () => {
                it("returns correct cart", async () => {
                    const data = {
                        buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                        productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                    };
                    const response = await (0, supertest_1.default)(app_1.app.server)
                        .post("/api/carts/addLineItem")
                        .send(data)
                        .set("Content-type", "application/json")
                        .expect(200);
                    const expected = {
                        id: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                        buyerId: "dc60209d-1feb-4465-b936-882e93bcd0c9",
                        lineItems: [
                            {
                                productId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
                                unitPrice: 299.99,
                                quantity: 2,
                            },
                            {
                                productId: "8bc94226-3e20-40cb-a507-554fabf36ffa",
                                unitPrice: 39.99,
                                quantity: 3,
                            },
                        ],
                        appliedVoucher: null,
                    };
                    expect(response.body).toEqual(expected);
                });
            });
        });
        describe("and cart has voucher", () => {
            it("returns correct cart", async () => {
                const data = {
                    buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                };
                const response = await (0, supertest_1.default)(app_1.app.server)
                    .post("/api/carts/addLineItem")
                    .send(data)
                    .set("Content-type", "application/json")
                    .expect(200);
                const expected = {
                    id: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                    lineItems: [
                        {
                            productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                            unitPrice: 79.99,
                            quantity: 3,
                        },
                    ],
                    appliedVoucher: {
                        voucherId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
                        type: "fixed",
                        amount: 50,
                    },
                };
                expect(response.body).toEqual(expected);
            });
        });
    });
    describe("When buyerId wasn't found", () => {
        it("returns correct cart", async () => {
            const data = {
                buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx",
                productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            };
            const response = await (0, supertest_1.default)(app_1.app.server)
                .post("/api/carts/addLineItem")
                .send(data)
                .set("Content-type", "application/json")
                .expect(404);
            const notFoundError = {
                title: "Not Found Error",
                status: 404,
                detail: `Couldn't find cart with buyerId: ${data.buyerId} in database. Verify if you are passing the correct buyerId.`,
            };
            expect(response.body).toEqual(notFoundError);
        });
    });
    describe("When update the cart gives error", () => {
        it("returns error", async () => {
            const data = {
                buyerId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcx",
                productId: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            };
            const response = await (0, supertest_1.default)(app_1.app.server)
                .post("/api/carts/addLineItem")
                .send(data)
                .set("Content-type", "application/json")
                .expect(404);
            const notFoundError = {
                title: "Not Found Error",
                status: 404,
                detail: `Couldn't find product with id: ${data.productId} in database. Verify if you are passing the correct productId.`,
            };
            expect(response.body).toEqual(notFoundError);
        });
    });
});
