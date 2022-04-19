import * as Cart from "../../../domain/entities/Cart";
import { LineItems } from "../../../domain/entities/Cart";
import { AppliedVoucher } from "../../../domain/valueObjects/AppliedVoucher";
import { CartModel } from "../../database/knex/models/CartModel";

interface AditionalProps {
  lineItems: LineItems; 
  appliedVoucher?: AppliedVoucher;
}

const ObjectionCartMapper = {
  toEntity(dataValues: CartModel, aditionalProps: AditionalProps) {
    const {
      uuid,
      buyerId,
    } = dataValues;
    const {lineItems, appliedVoucher} = aditionalProps

    return Cart.createCart({
      id: uuid,
      buyerId,
      lineItems,
      appliedVoucher
    });
  },
  toDatabase(cart: Cart.Cart) {
    const { id, buyerId} = cart;
    const { voucherId, type, amount, minValue} = (cart.appliedVoucher || {});
    return {
      uuid: id,
      buyerId,
      voucherId,
      type,
      amount: amount?.getAmount(),
      minValue: minValue?.getAmount()
    };
  },
};

export { ObjectionCartMapper };
