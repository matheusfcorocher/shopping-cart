import * as Cart from "../../../../../../src/domain/entities/Cart";
import * as Voucher from "../../../../../../src/domain/entities/Voucher";
import { appliedFactory } from "../../../../../../src/domain/factories/AppliedVoucherFactory";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import { CartModel } from "../../../../../../src/infra/database/knex/models/CartModel";
import { ObjectionCartMapper } from "../../../../../../src/infra/repositories/cart/ObjectionCartMapper";
import { CartModelData } from "../../../../../support/factories/models/CartModelFactory";

describe("Infra :: Cart :: ObjectionCartMapper", () => {

  describe(".toEntity", () => {
    it("returns cart instance with passed props", () => {
      const cartModel: CartModel = new CartModel();
      const cartObject: CartModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        voucherId: "2a20283a-2371-441f-af6e-899fe63def5c",
        type: "fixed",
        amount: 5000,
      };
      cartModel.$setJson(cartObject);
      const { uuid, buyerId, voucherId, type, amount, minValue } = cartModel;
      let appliedVoucher = undefined;
      if (voucherId && type && amount && minValue) {
        const voucherType = <Voucher.VoucherType>type;
        const voucher = Voucher.createVoucher({
          id: voucherId,
          code: "null",
          type: voucherType,
          amount: createMoney(amount),
          minValue: createMoney(minValue),
        });
        appliedVoucher = appliedFactory.fromVoucher(voucher);
      }
      const lineItems = [Cart.createLineItem({productId: "2a20283a-2371-441f-af6e-899fe63def5c", unitPrice: createMoney(1999), quantity: 5}), ];
      const expected = Cart.createCart({ id: uuid, buyerId, appliedVoucher, lineItems });

      expect(ObjectionCartMapper.toEntity(cartModel, {appliedVoucher, lineItems})).toEqual(expected);
    });
  });

  describe(".toDatabase", () => {
    it("returns prepared object to be persisted", () => {
      const lineItems = [Cart.createLineItem({productId: "2a20283a-2371-441f-af6e-899fe63def5c", unitPrice: createMoney(1999), quantity: 5})];
      const cartObject: CartModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        voucherId: "2a20283a-2371-441f-af6e-899fe63def5c",
        type: "fixed",
        amount: 5000,
      };
      const voucherType = <Voucher.VoucherType>cartObject.type;
      const voucher = Voucher.createVoucher({
        id: cartObject.uuid,
        code: "null",
        type: voucherType,
        amount: createMoney(cartObject.amount!),
      });
      const appliedVoucher = appliedFactory.fromVoucher(voucher);
      const cart = Cart.createCart({
        id: "2a20283a-2371-441f-af6e-899fe63def5c",
        buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        lineItems,
        appliedVoucher
      });
      const expected = {
        uuid: cart.id,
        buyerId: cart.buyerId,
        voucherId: voucher.id,
        type: voucher.type,
        amount: voucher.amount?.getAmount(),
      };

      expect(ObjectionCartMapper.toDatabase(cart)).toEqual(
        expected
      );
    });
  });
});
