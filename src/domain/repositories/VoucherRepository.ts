import { Voucher } from "../entities";

interface VoucherRepository {
    getAllVouchers(): Promise<Array<Voucher>>
    getVoucherById(id:number) : Voucher
}

export { VoucherRepository };