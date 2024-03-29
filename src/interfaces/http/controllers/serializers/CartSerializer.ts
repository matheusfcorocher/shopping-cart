import { Cart } from "../../../../domain/entities/index";
import { VoucherType } from "../../../../domain/entities/Voucher";

interface serializedLineItem {
  productId: string;
  unitPrice: number;
  quantity: number;
}

type serializedLineItems = Array<serializedLineItem>;
interface SerializedAppliedVoucherProps {
  voucherId?: string | undefined;
  type?: VoucherType | undefined;
  amount?: number | null | undefined;
  minValue?: number | null | undefined;
}

type SerializedCartProps = {
  id: string;
  buyerId?: string;
  lineItems: serializedLineItems;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  appliedVoucher?: SerializedAppliedVoucherProps;
};

const CartSerializer = {
  serialize(cart: Cart): SerializedCartProps {
    const { id, buyerId, lineItems, appliedVoucher, subtotal, shipping, discount, total } = cart;
    const serializedLineItems = lineItems.map((lineItem) => {
      const { productId, unitPrice, quantity } = lineItem;
      return { productId, unitPrice: unitPrice.toUnit(), quantity };
    });
    
    const { voucherId, type, amount, minValue } = appliedVoucher || {};
    return {
      id,
      buyerId,
      lineItems: serializedLineItems,
      subtotal: subtotal.toUnit(),
      shipping: shipping.toUnit(),
      discount: discount.toUnit(),
      total: total.toUnit(),
      appliedVoucher: { voucherId, type, amount: amount?.toUnit(), minValue: minValue?.toUnit() },
    };
  },
};

export { CartSerializer };
