import { Voucher } from "../entities";

interface VoucherRepository {
    getAllVouchers(): Promise<Array<Voucher>>
    getVoucherById(id:string) : Promise<Voucher>
    getVoucherByCode(code : string) : Promise<Voucher>
    getNextId() : string;
}

export { VoucherRepository };