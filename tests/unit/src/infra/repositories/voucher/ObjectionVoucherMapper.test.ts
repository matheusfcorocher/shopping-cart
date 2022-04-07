import { Voucher } from "../../../../../../src/domain/entities";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import { VoucherModel } from "../../../../../../src/infra/database/knex/models/VoucherModel";
import {
  ObjectionVoucherMapper,
} from "../../../../../../src/infra/repositories/voucher/ObjectionVoucherMapper";
import { VoucherModelData } from "../../../../../support/factories/models/VoucherModelFactory";
describe("Infra :: Voucher :: ObjectionVoucherMapper", () => {
  describe(".toEntity", () => {
    describe("when voucher has fixed type", () => {
      it("returns voucher instance with passed object", () => {
        const voucherModel: VoucherModel = new VoucherModel();
        const voucherObject : VoucherModelData = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "percentual",
          amount: 50,
        }
        voucherModel.$setJson(voucherObject);
        const { uuid, code, type, amount } = voucherObject;
        const answer = new Voucher({
          id: uuid,
          code,
          type,
          amount: createMoney(amount),
        });

        expect(JSON.stringify(ObjectionVoucherMapper.toEntity(voucherModel))).toEqual(
          JSON.stringify(answer)
        );
      });
    });
    describe("when voucher has percentual type", () => {
      it("returns voucher instance with passed object", () => {
        const voucherModel: VoucherModel = new VoucherModel();
        const voucherObject : VoucherModelData = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "percentual",
          amount: 50,
        }
        voucherModel.$setJson(voucherObject);
        const { uuid, code, type, amount } = voucherObject;
        const answer = new Voucher({
          id: uuid,
          code,
          type,
          amount: createMoney(amount),
        });

        expect(JSON.stringify(ObjectionVoucherMapper.toEntity(voucherModel))).toEqual(
          JSON.stringify(answer)
        );
      });
    });
    describe("when voucher has free shipping type", () => {
      it("returns voucher instance with passed object", () => {
        const voucherModel: VoucherModel = new VoucherModel();
        const voucherObject : VoucherModelData = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "free shipping",
          amount: 2000,
          minValue: 2000,
        }
        voucherModel.$setJson(voucherObject);
        const { uuid, code, type, amount, minValue } = voucherObject;
        const answer = new Voucher({
          id: uuid,
          code,
          type,
          amount: createMoney(amount),
          minValue: createMoney(minValue!),
        });

        expect(JSON.stringify(ObjectionVoucherMapper.toEntity(voucherModel))).toEqual(
          JSON.stringify(answer)
        );
      });
    });
  });

  describe(".toDatabase", () => {
    describe("when voucher has fixed type", () => {
      it("returns prepared object to be persisted", () => {
        const dbVoucherObject: VoucherModelData = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "fixed",
          amount: 100,
        };
        const { uuid, code, type, amount } = dbVoucherObject;
        const voucher = new Voucher({
          id: uuid,
          code,
          type,
          amount: createMoney(amount),
        });
        const answer = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "fixed",
          amount: 100,
          minValue: null,
        };

        expect(ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
      });
    });
    describe("when voucher has percentual type", () => {
      it("returns prepared object to be persisted", () => {
        const dbVoucherObject: VoucherModelData = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "percentual",
          amount: 100,
        };
        const { uuid, code, type, amount } = dbVoucherObject;
        const voucher = new Voucher({
          id: uuid,
          code,
          type,
          amount: createMoney(amount),
        });
        const answer = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "percentual",
          amount: 100,
          minValue: null,
        };

        expect(ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
      });
    });
    describe("when voucher has free shipping type", () => {
      it("returns prepared object to be persisted", () => {
        const dbVoucherObject: VoucherModelData = {
          uuid: "TEST-TEST",
          code: "TEST",
          type: "free shipping",
          amount: 40,
          minValue: 40,
        };
        const { uuid, code, type, amount, minValue } = dbVoucherObject;
        const voucher = new Voucher({
          id: uuid,
          code,
          type,
          amount: createMoney(amount),
          minValue: createMoney(minValue!),
        });
        const answer = {
          uuid,
          code,
          type,
          amount,
          minValue,
        };

        expect(ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
      });
    });
  });
});
