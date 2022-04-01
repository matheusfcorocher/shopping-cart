"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex("products").del();
    // Inserts seed entries
    await knex("products").insert([
        {
            id: 1,
            uuid: "9c457311-1836-45fa-aac9-9b397b3f7eb6",
            name: "Chocolate",
            price: 19.99,
            available: 20,
        },
        {
            id: 2,
            uuid: "0395127e-89c5-4bef-88b3-8b975a856ca9",
            name: "Apple",
            price: 9.99,
            available: 1,
        },
        {
            id: 3,
            uuid: "4fcab276-67d8-4ae0-9ccf-7adceaea449f",
            name: "Pear",
            price: 8.99,
            available: 0,
        },
    ]);
}
exports.seed = seed;
