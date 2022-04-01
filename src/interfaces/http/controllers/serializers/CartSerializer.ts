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
  appliedVoucher?: SerializedAppliedVoucherProps;
};

const CartSerializer = {
  serialize({
    id,
    buyerId,
    lineItems,
    appliedVoucher,
  }: Cart): SerializedCartProps {
    const serializedLineItems = lineItems.map((lineItem) => {
      const { productId, unitPrice, quantity } = lineItem;
      return { productId, unitPrice, quantity };
    });
    const { voucherId, type, amount, minValue } = (appliedVoucher || {});
    return {
      id,
      buyerId,
      lineItems: serializedLineItems,
      appliedVoucher: { voucherId, type, amount, minValue },
    };
  },
};

export { CartSerializer };
