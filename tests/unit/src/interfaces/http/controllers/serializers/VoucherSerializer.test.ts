import { Voucher } from "../../../../../../../src/domain/entities";
import { createMoney } from "../../../../../../../src/domain/valueObjects/Money";
import { VoucherSerializer } from "../../../../../../../src/interfaces/http/controllers/serializers/VoucherSerializer";

describe("Interfaces :: HTTP :: Voucher :: VoucherSerializer", () => {
  it("returns id, code, type and amount", () => {
    const voucher = new Voucher({
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      code: "AMAZING",
      type: "percentual",
      amount: createMoney(4000),
    });

    const expected = {
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      code: "AMAZING",
      type: "percentual",
      amount: 40.0,
    };

    expect(VoucherSerializer.serialize(voucher)).toEqual(expected);
  });
  it("returns id, code, type and minValue", () => {
    const voucher = new Voucher({
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      code: "AMAZING",
      type: "free shipping",
      minValue: createMoney(5000),
    });

    const expected = {
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      code: "AMAZING",
      type: "free shipping",
      minValue: 50.0,
    };

    expect(VoucherSerializer.serialize(voucher)).toEqual(expected);
  });
});
