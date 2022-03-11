import { Voucher } from "../../../../../../src/domain/entities";
import {
  dbVoucherProps,
  ObjectionVoucherMapper,
} from "../../../../../../src/infra/repositories/voucher/ObjectionVoucherMapper";
describe("Infra :: Voucher :: ObjectionVoucherMapper", () => {
  describe(".toEntity", () => {
    describe("when voucher has fixed type", () => {
      it("returns voucher instance with passed object", () => {
        const dbVoucherObject: dbVoucherProps = {
          id: 1,
          uuid: "TEST-TEST",
          code: "TEST",
          type: "fixed",
          amount: 100,
        };
        const { uuid, code, type, amount } = dbVoucherObject;
        const answer = new Voucher({
          id: uuid,
          code,
          type,
          amount,
        });

        expect(ObjectionVoucherMapper.toEntity(dbVoucherObject)).toEqual(
          answer
        );
      });
    });
    describe("when voucher has percentual type", () => {
      it("returns voucher instance with passed object", () => {
        const dbVoucherObject: dbVoucherProps = {
          id: 1,
          uuid: "TEST-TEST",
          code: "TEST",
          type: "percentual",
          amount: 50,
        };
        const { uuid, code, type, amount } = dbVoucherObject;
        const answer = new Voucher({
          id: uuid,
          code,
          type,
          amount,
        });

        expect(ObjectionVoucherMapper.toEntity(dbVoucherObject)).toEqual(
          answer
        );
      });
    });
    describe("when voucher has free shipping type", () => {
      it("returns voucher instance with passed object", () => {
        const dbVoucherObject: dbVoucherProps = {
          id: 1,
          uuid: "TEST-TEST",
          code: "TEST",
          type: "free shipping",
          amount: 20,
          minValue: 20,
        };
        const { uuid, code, type, amount, minValue } = dbVoucherObject;
        const answer = new Voucher({
          id: uuid,
          code,
          type,
          amount,
          minValue,
        });

        expect(ObjectionVoucherMapper.toEntity(dbVoucherObject)).toEqual(
          answer
        );
      });
    });
  });

  describe(".toDatabase", () => {
    describe("when voucher has fixed type", () => {
      it("returns prepared object to be persisted", () => {
        const dbVoucherObject: dbVoucherProps = {
          id: 1,
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
          amount,
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
        const dbVoucherObject: dbVoucherProps = {
          id: 1,
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
          amount,
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
        const dbVoucherObject: dbVoucherProps = {
          id: 1,
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

        expect(ObjectionVoucherMapper.toDatabase(voucher)).toEqual(answer);
      });
    });
  });
});
