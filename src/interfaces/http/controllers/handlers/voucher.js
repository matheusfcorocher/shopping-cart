"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVouchersListHandler = void 0;
const VoucherSerializer_1 = require("../serializers/VoucherSerializer");
const getVouchersListHandler = async (req, reply) => {
    try {
        const { listVouchers } = req.container.vouchers;
        const result = await listVouchers.execute();
        console.log(result.map(r => VoucherSerializer_1.VoucherSerializer.serialize(r)));
        reply.send(result.map(r => VoucherSerializer_1.VoucherSerializer.serialize(r)));
    }
    catch (error) {
        switch (error.CODE) {
            default:
                const { message, details } = error;
                return reply.status(500).send({ message, details });
        }
    }
};
exports.getVouchersListHandler = getVouchersListHandler;
