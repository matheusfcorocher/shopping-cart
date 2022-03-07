import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("orders", function (table) {
        table.increments();
        table.uuid("uuid").notNullable().unique();
        table.foreign("buyerId").references('uuid').inTable('buyers');
        table.float("subtotal").notNullable(); 
        table.float("shipping").notNullable(); 
        table.float("discount").notNullable(); 
        table.float("total").notNullable(); 
        table.string("paymentMethod").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('orders');
}

