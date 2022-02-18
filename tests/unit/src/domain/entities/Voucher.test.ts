import { Voucher } from "../../../../../src/domain/entities";

describe("Domain :: Entity :: Voucher", () => {
  describe("#isPercentual", () => {
    describe("if voucher has percentual type", () => {
      it("returns true", () => {
        const voucher = new Voucher(
          1,
          "#F121221",
          "percentual",
          30.0,
        );
        expect(voucher.isPercentual()).toEqual(true);
      });
    });
    describe("if voucher doesn't have percentual type", () => {
      it("returns false", () => {
        const voucher = new Voucher(
          1,
          "#F121221",
          "free shipping",
          30.0,
        );
        expect(voucher.isPercentual()).toEqual(false);
      });
    });
  });
  describe("#isFixed", () => {
    describe("if voucher has fixed type", () => {
      it("returns true", () => {
        const voucher = new Voucher(
          1,
          "#F121221",
          "fixed",
          30.0,
        );
        expect(voucher.isFixed()).toEqual(true);
      });
    });
    describe("if voucher doesn't have fixed type", () => {
      it("returns false", () => {
        const voucher = new Voucher(
          1,
          "#F121221",
          "free shipping",
          0,
        );
        expect(voucher.isFixed()).toEqual(false);
      });
    });
  });
  describe("#isFreeShipping", () => {
    describe("if voucher has free shipping type", () => {
      it("returns true", () => {
        const voucher = new Voucher(
          1,
          "#F121221",
          "free shipping",
          30.0,
          50,
        );
        expect(voucher.isFreeShipping()).toEqual(true);
      });
    });
    describe("if voucher doesn't have free shipping type", () => {
      it("returns false", () => {
        const voucher = new Voucher(
          1,
          "#F121221",
          "fixed",
          30.0,
        );
        expect(voucher.isFreeShipping()).toEqual(false);
      });
    });
  });
});
