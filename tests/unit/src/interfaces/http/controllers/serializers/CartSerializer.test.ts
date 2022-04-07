import { LineItem } from "../../../../../../../src/domain/entities/Cart";
import { Voucher, Cart } from "../../../../../../../src/domain/entities";
import { VoucherType } from "../../../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../../../src/domain/factories/AppliedVoucherFactory";
import { CartSerializer } from "../../../../../../../src/interfaces/http/controllers/serializers/CartSerializer";
import { createMoney } from "../../../../../../../src/domain/valueObjects/Money";

describe("Interfaces :: HTTP :: Cart :: CartSerializer", () => {
  it("returns id, buyerId, lineItems and appliedVoucher", () => {
    const lineItems = [
      new LineItem("2a20283a-2371-441f-af6e-899fe63def5c", createMoney(1999), 5),
    ];
    const voucherType = <VoucherType>"fixed";
    const voucher = new Voucher({
      id: "2a20283a-2371-441f-af6e-899fe63def5c",
      code: "null",
      type: voucherType,
      amount: createMoney(5000),
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
      discount: 50,
      shipping: 30,
      subtotal: 99.95,
      total: 79.95,
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
        amount: 50.0,
        minValue: undefined,
      },
    };

    expect(CartSerializer.serialize(cart)).toEqual(expected);
  });
});
