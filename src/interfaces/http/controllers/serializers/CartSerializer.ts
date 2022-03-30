import { CartProps } from "../../../../domain/entities/Cart";
import { Cart } from "../../../../domain/entities/index";

const CartSerializer = {
  serialize({ id, buyerId, lineItems, appliedVoucher }: Cart): CartProps {
    return {
      id,
      buyerId,
      lineItems,
      appliedVoucher,
    };
  },
};

export { CartSerializer };
