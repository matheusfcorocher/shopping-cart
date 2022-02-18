import { Voucher } from "../../../src/domain/entities";
import { VoucherRepository } from "../../../src/domain/repositories/VoucherRepository";

class FakeVoucherRepository implements VoucherRepository {
    products: Array<Voucher>;

    constructor(products: Array<Voucher>) {
        this.products = products;
    } 
    getAllVouchers(): Promise<Voucher[]> {
        return Promise.resolve(this.products);
    }
}

export {FakeVoucherRepository};