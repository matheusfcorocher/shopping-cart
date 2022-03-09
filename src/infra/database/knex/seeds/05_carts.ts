import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("carts").del();

  // Inserts seed entries
  await knex("carts").insert([
    {
      uuid: "23824152-86e7-44d9-bbce-bc1a45e9b690",
      buyerId: "9c457311-1836-45fa-aac9-9b397b3f7eb6",
      voucherId: null,
      type: null,
      amount: null,
    },
    {
      uuid: "4bc599a2-569c-4720-bf5f-d9ee6c0b4aa2",
      buyerId: "580863bc-e364-48eb-a8e5-04100e494bc7",
      voucherId: "92d91715-34ad-449e-9b81-73f1a74ef44e",
      type: "fixed",
      amount: 50,
    },
  ]);
}
