"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../../../../../../src/domain/entities");
const VoucherModel_1 = require("../../../../../../src/infra/database/knex/models/VoucherModel");
const ObjectionVoucherMapper_1 = require("../../../../../../src/infra/repositories/voucher/ObjectionVoucherMapper");
describe("Infra :: Voucher :: ObjectionVoucherMapper", () => {
    describe(".toEntity", () => {
        describe("when voucher has fixed type", () => {
            it("returns voucher instance with passed object", () => {
                const voucherModel = new VoucherModel_1.VoucherModel();
                const voucherObject = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "percentual",
                    amount: 50,
                };
                voucherModel.$setJson(voucherObject);
                const { uuid, code, type, amount } = voucherObject;
                const answer = new entities_1.Voucher({
                    id: uuid,
                    code,
                    type,
                    amount,
                });
                expect(ObjectionVoucherMapper_1.ObjectionVoucherMapper.toEntity(voucherModel)).toEqual(answer);
            });
        });
        describe("when voucher has percentual type", () => {
            it("returns voucher instance with passed object", () => {
                const voucherModel = new VoucherModel_1.VoucherModel();
                const voucherObject = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "percentual",
                    amount: 50,
                };
                voucherModel.$setJson(voucherObject);
                const { uuid, code, type, amount } = voucherObject;
                const answer = new entities_1.Voucher({
                    id: uuid,
                    code,
                    type,
                    amount,
                });
                expect(ObjectionVoucherMapper_1.ObjectionVoucherMapper.toEntity(voucherModel)).toEqual(answer);
            });
        });
        describe("when voucher has free shipping type", () => {
            it("returns voucher instance with passed object", () => {
                const voucherModel = new VoucherModel_1.VoucherModel();
                const voucherObject = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "free shipping",
                    amount: 20,
                    minValue: 20,
                };
                voucherModel.$setJson(voucherObject);
                const { uuid, code, type, amount, minValue } = voucherObject;
                const answer = new entities_1.Voucher({
                    id: uuid,
                    code,
                    type,
                    amount,
                    minValue,
                });
                expect(ObjectionVoucherMapper_1.ObjectionVoucherMapper.toEntity(voucherModel)).toEqual(answer);
            });
        });
    });
    describe(".toDatabase", () => {
        describe("when voucher has fixed type", () => {
            it("returns prepared object to be persisted", () => {
                const dbVoucherObject = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "fixed",
                    amount: 100,
                };
                const { uuid, code, type, amount } = dbVoucherObject;
                const voucher = new entities_1.Voucher({
                    id: uuid,
                    code,
                    type,
                    amount,
                });
                const answer = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "fixed",
                    amount: 100,
                    minValue: null,
                };
                expect(ObjectionVoucherMapper_1.ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
            });
        });
        describe("when voucher has percentual type", () => {
            it("returns prepared object to be persisted", () => {
                const dbVoucherObject = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "percentual",
                    amount: 100,
                };
                const { uuid, code, type, amount } = dbVoucherObject;
                const voucher = new entities_1.Voucher({
                    id: uuid,
                    code,
                    type,
                    amount,
                });
                const answer = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "percentual",
                    amount: 100,
                    minValue: null,
                };
                expect(ObjectionVoucherMapper_1.ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
            });
        });
        describe("when voucher has free shipping type", () => {
            it("returns prepared object to be persisted", () => {
                const dbVoucherObject = {
                    uuid: "TEST-TEST",
                    code: "TEST",
                    type: "free shipping",
                    amount: 40,
                    minValue: 40,
                };
                const { uuid, code, type, amount, minValue } = dbVoucherObject;
                const voucher = new entities_1.Voucher({
                    id: uuid,
                    code,
                    type,
                    amount,
                    minValue,
                });
                const answer = {
                    uuid,
                    code,
                    type,
                    amount,
                    minValue,
                };
                expect(ObjectionVoucherMapper_1.ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
            });
        });
    });
});
