"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex("orders").del();
    // Inserts seed entries
    await knex("orders").insert([
        {
            uuid: "988436dc-b2ce-4061-8d5b-07ad025ed074",
            buyerId: "580863bc-e364-48eb-a8e5-04100e494bc7",
            paymentMethod: "credit card",
        },
    ]);
}
exports.seed = seed;
