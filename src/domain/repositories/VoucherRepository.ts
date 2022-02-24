import { Voucher } from "../entities";

interface VoucherRepository {
    getAllVouchers(): Promise<Array<Voucher>>
    getVoucherById(id:number) : Promise<Voucher>
    getVoucherByCode(code : string) : Promise<Voucher>
}

export { VoucherRepository };