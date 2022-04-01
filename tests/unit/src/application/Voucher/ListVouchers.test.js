"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListVouchers_1 = __importDefault(require("../../../../../src/application/Voucher/ListVouchers"));
const entities_1 = require("../../../../../src/domain/entities");
const FakeVoucherRepository_1 = require("../../../../support/repositories/FakeVoucherRepository");
describe("Application :: Voucher :: ListVouchers", () => {
    describe("#execute", () => {
        describe("When execute the method", () => {
            it("returns products", async () => {
                const products = [new entities_1.Voucher({ id: `aaa`, code: "#X321", type: "fixed", amount: 100 })];
                const productRepo = new FakeVoucherRepository_1.FakeVoucherRepository(products);
                const listVouchers = new ListVouchers_1.default(productRepo);
                expect(await listVouchers.execute()).toEqual(products);
            });
        });
        describe("When service is unavailable", () => {
            it("returns error", async () => {
                const products = [new entities_1.Voucher({ id: `aaa`, code: "#X322", type: "percentual", amount: 100 })];
                const productRepo = new FakeVoucherRepository_1.FakeVoucherRepository(products);
                const error = new Error("Service Unavailable");
                productRepo.getAllVouchers = () => Promise.reject(error);
                const listVouchers = new ListVouchers_1.default(productRepo);
                await expect(() => listVouchers.execute()).rejects.toThrow(error);
            });
        });
    });
});
