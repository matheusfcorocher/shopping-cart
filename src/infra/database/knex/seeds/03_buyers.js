"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex("buyers").del();
    // Inserts seed entries
    await knex("buyers").insert([
        {
            id: 1,
            uuid: "9c457311-1836-45fa-aac9-9b397b3f7eb6",
            firstName: "Matheus",
            lastName: "Matheus",
            birthDate: "1995-06-23",
            email: "matheus@gmail.com",
            postalCode: "132004-32",
            street: "Rua do Teste",
            district: "Bairro Alto",
            city: "Piracicaba",
            country: "Brazil",
        },
        {
            id: 2,
            uuid: "580863bc-e364-48eb-a8e5-04100e494bc7",
            firstName: "Juan",
            lastName: "Juan",
            birthDate: "1998-03-23",
            email: "juan@gmail.com",
            postalCode: "134404-32",
            street: "Rua do Teste",
            district: "Bairro do Teste",
            city: "Piracicaba",
            country: "Brazil",
        },
    ]);
}
exports.seed = seed;
