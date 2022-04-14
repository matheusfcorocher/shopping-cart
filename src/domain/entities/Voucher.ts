import { Money } from "../valueObjects/Money";

type VoucherType = "percentual" | "fixed" | "free shipping";

// export default class Voucher {
//   id: string;
//   code: string;
//   type: VoucherType;
//   amount?: Money | null;
//   minValue?: Money | null;

//   constructor({id, code, type, amount, minValue} : VoucherProps) {
//     this.id = id;
//     this.code = code;
//     this.type = type;
//     this.amount = amount;
//     this.minValue = minValue
//   }
// }

type VoucherProps = {
  id: string;
  code: string;
  type: VoucherType;
  amount?: Money | null;
  minValue?: Money | null;
};

type Voucher = {
  id: string;
  code: string;
  type: VoucherType;
  amount?: Money | null;
  minValue?: Money | null;
};

function createVoucher({ id, code, type, amount, minValue }: VoucherProps) : Voucher {
  return { id, code, type, amount, minValue };
};

export { createVoucher, VoucherType, VoucherProps };
