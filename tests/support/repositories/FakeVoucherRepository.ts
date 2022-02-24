import { Voucher } from "../../../src/domain/entities";
import { VoucherRepository } from "../../../src/domain/repositories/VoucherRepository";

class FakeVoucherRepository implements VoucherRepository {
    vouchers: Array<Voucher>;

    constructor(vouchers: Array<Voucher>) {
        this.vouchers = vouchers;
    } 
    getVoucherByCode(code: string): Promise<Voucher> {
        const result = this.vouchers.filter((voucher) => voucher.code === code)[0];
        if (result === undefined) {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Voucher with code ${code} can't be found.`;
        return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    getVoucherById(id: number): Promise<Voucher> {
        const result = this.vouchers.filter((voucher) => voucher.id === id)[0];
        if (result === undefined) {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Voucher with id ${id} can't be found.`;
        return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    getAllVouchers(): Promise<Voucher[]> {
        return Promise.resolve(this.vouchers);
    }
}

export {FakeVoucherRepository};