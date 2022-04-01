"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex("vouchers").del();
    // Inserts seed entries
    await knex("vouchers").insert([
        {
            id: 1,
            uuid: "7ea29c37-f9e7-4453-bc58-50ed4b5c0fcf",
            code: "PERCENTUAL",
            type: "percentual",
            amount: 100,
        },
        {
            id: 2,
            uuid: "92d91715-34ad-449e-9b81-73f1a74ef44e",
            code: "FIXED",
            type: "fixed",
            amount: 50,
        },
        {
            id: 3,
            uuid: "8bc94226-3e20-40cb-a507-554fabf36ffa",
            code: "FREE-SHIPPING",
            type: "free shipping",
            amount: 100,
            minValue: 100,
        },
    ]);
}
exports.seed = seed;
