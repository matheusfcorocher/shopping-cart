import { ConcreteEntityFactory } from "../../../../support/factories/data";
const entityFactory = new ConcreteEntityFactory();

describe("Domain :: Entity :: Voucher", () => {
  describe("#isPercentual", () => {
    describe("if voucher has percentual type", () => {
      it("returns true", () => {
        const voucher = entityFactory.voucherCreatorMachine().create({
          id: 1,
          code: "#F121221",
          type: "percentual",
          amount: 30.0,
        });
        expect(voucher.isPercentual()).toEqual(true);
      });
    });
    describe("if voucher doesn't have percentual type", () => {
      it("returns false", () => {
        const voucher = entityFactory.voucherCreatorMachine().create({
          id: 1,
          code: "#F121221",
          type: "free shipping",
          amount: 30.0,
        });
        expect(voucher.isPercentual()).toEqual(false);
      });
    });
  });
  describe("#isFixed", () => {
    describe("if voucher has fixed type", () => {
      it("returns true", () => {
        const voucher = entityFactory.voucherCreatorMachine().create({
          id: 1,
          code: "#F121221",
          type: "fixed",
          amount: 30.0,
        });
        expect(voucher.isFixed()).toEqual(true);
      });
    });
    describe("if voucher doesn't have fixed type", () => {
      it("returns false", () => {
        const voucher = entityFactory.voucherCreatorMachine().create({
          id: 1,
          code: "#F121221",
          type: "free shipping",
          amount: 30.0,
        });
        expect(voucher.isFixed()).toEqual(false);
      });
    });
  });
  describe("#isFreeShipping", () => {
    describe("if voucher has free shipping type", () => {
      it("returns true", () => {
        const voucher = entityFactory.voucherCreatorMachine().create({
          id: 1,
          code: "#F121221",
          type: "free shipping",
          amount: 30.0,
        });
        expect(voucher.isFreeShipping()).toEqual(true);
      });
    });
    describe("if voucher doesn't have free shipping type", () => {
      it("returns false", () => {
        const voucher = entityFactory.voucherCreatorMachine().create({
          id: 1,
          code: "#F121221",
          type: "fixed",
          amount: 30.0,
        });
        expect(voucher.isFreeShipping()).toEqual(false);
      });
    });
  });
});
