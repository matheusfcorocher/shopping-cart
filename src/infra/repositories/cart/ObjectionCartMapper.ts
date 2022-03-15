import { Cart } from "../../../domain/entities";
import { LineItems } from "../../../domain/entities/Cart";
import { AppliedVoucher } from "../../../domain/valueObjects/AppliedVoucher";
import { CartModel } from "../../database/knex/models";

interface VoucherProps {
  voucherId: string;
  type: string;
  amount: number;
}

interface AditionalProps {
  lineItems: LineItems; 
  appliedVoucher: AppliedVoucher;
}

const ObjectionCartMapper = {
  toEntity(dataValues: CartModel, aditionalProps: AditionalProps) {
    const {
      uuid,
      buyerId,
    } = dataValues;
    const {lineItems, appliedVoucher} = aditionalProps

    return new Cart({
      id: uuid,
      buyerId,
      lineItems,
      appliedVoucher
    });
  },
  toDatabase(cart: Cart, voucherProps: VoucherProps) {
    const { id, buyerId} = cart;
    const { voucherId, type, amount} = voucherProps;
    return {
      uuid: id,
      buyerId,
      voucherId,
      type,
      amount
    };
  },
};

export { ObjectionCartMapper };
