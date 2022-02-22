import { Voucher } from "../../../src/domain/entities";
import { VoucherRepository } from "../../../src/domain/repositories/VoucherRepository";

class FakeVoucherRepository implements VoucherRepository {
    vouchers: Array<Voucher>;

    constructor(vouchers: Array<Voucher>) {
        this.vouchers = vouchers;
    } 
    getVoucherById(id: number): Voucher {
        throw new Error("Method not implemented.");
    }
    getAllVouchers(): Promise<Voucher[]> {
        return Promise.resolve(this.vouchers);
    }
}

export {FakeVoucherRepository};