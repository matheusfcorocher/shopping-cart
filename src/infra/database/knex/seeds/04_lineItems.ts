import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("lineItems").del();

  // Inserts seed entries
  await knex("lineItems").insert([
    {
      uuid: "76cbf90a-131d-40d6-afea-1d1d895ca4f8",
      productId: "9c457311-1836-45fa-aac9-9b397b3f7eb6",
      unitPrice: 19.99,
      quantity: 3,
      ownerId: "23824152-86e7-44d9-bbce-bc1a45e9b690",
      ownerType: "cart",
    },
    {
      uuid: "e4c6ec06-a776-438d-9d64-3370f63f9c77",
      productId: "9c457311-1836-45fa-aac9-9b397b3f7eb6",
      unitPrice: 19.99,
      quantity: 5,
      ownerId: "988436dc-b2ce-4061-8d5b-07ad025ed074",
      ownerType: "order",
    },
  ]);
}
