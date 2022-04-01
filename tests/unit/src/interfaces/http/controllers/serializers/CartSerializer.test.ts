import { LineItem } from "../../../../../../../src/domain/entities/Cart";
import { Voucher, Cart } from "../../../../../../../src/domain/entities";
import { VoucherType } from "../../../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../../../src/domain/factories/AppliedVoucherFactory";
import { CartSerializer } from "../../../../../../../src/interfaces/http/controllers/serializers/CartSerializer";

describe("Interfaces :: HTTP :: Cart :: CartSerializer", () => {
  it("returns id, buyerId, lineItems and appliedVoucher", () => {
    const lineItems = [
      new LineItem("2a20283a-2371-441f-af6e-899fe63def5c", 19.99, 5),
    ];
    const voucherType = <VoucherType>"fixed";
    const voucher = new Voucher({
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      code: "null",
      type: voucherType,
      amount: 50,
    });
    const appliedVoucher = appliedFactory.fromVoucher(voucher);
    const cart = new Cart({
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
      lineItems,
      appliedVoucher,
    });

    const expected = {
      id: cart.id,
      buyerId: cart.buyerId,
      lineItems: [
        {
          productId: "2a20283a-2371-441f-af6e-899fe63def5c",
          unitPrice: 19.99,
          quantity: 5,
        },
      ],
      appliedVoucher: {
        voucherId: "2a20283a-2371-441f-af6e-899fe63def5c",
        type: voucherType,
        amount: 50,
        minValue: undefined,
      },
    };

    expect(CartSerializer.serialize(cart)).toEqual(expected);
  });
});
