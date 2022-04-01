"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vouchersRoutes = void 0;
const voucher_1 = require("../controllers/handlers/voucher");
const voucher_2 = require("../controllers/schemas/voucher");
const listVouchersOpts = {
    schema: voucher_2.listVouchersSchema,
    handler: voucher_1.getVouchersListHandler,
};
const vouchersRoutes = (fastify, options, done) => {
    fastify.get("/api/vouchers", listVouchersOpts);
    done();
};
exports.vouchersRoutes = vouchersRoutes;
