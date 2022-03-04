import { v4 as uuidv4 } from 'uuid';
import { Voucher } from "../../../src/domain/entities";
import { VoucherRepository } from "../../../src/domain/repositories/VoucherRepository";

class FakeVoucherRepository implements VoucherRepository {
    vouchers: Array<Voucher>;

    constructor(vouchers: Array<Voucher>) {
        this.vouchers = vouchers;
    }

    public getAllVouchers(): Promise<Voucher[]> {
        return Promise.resolve(this.vouchers);
    } 

    public getNextId(): string {
        return uuidv4();
    }
    
    public getVoucherByCode(code: string): Promise<Voucher> {
        const result = this.vouchers.filter((voucher) => voucher.code.normalize() === code.normalize())[0];
        if (result === undefined) {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Voucher with code ${code} can't be found.`;
        return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    public getVoucherById(id: string): Promise<Voucher> {
        const result = this.vouchers.filter((voucher) => voucher.id === id)[0];
        if (result === undefined) {
        const notFoundError = new Error("Not Found Error");
        //   notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Voucher with id ${id} can't be found.`;
        return Promise.reject(notFoundError);
        }
        return Promise.resolve(result);
    }
    
}

export {FakeVoucherRepository};