import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("carts", function (table) {
    table.increments();
    table.uuid("uuid").notNullable().unique();
    table.uuid("buyerId").references('uuid').inTable('buyers');
    table.uuid("voucherId").references('uuid').inTable('vouchers'); //AppliedVoucher field
    table.string("type"); //AppliedVoucher field
    table.integer("amount"); //AppliedVoucher field
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('carts');
}
