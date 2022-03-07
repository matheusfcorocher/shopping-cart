import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('lineItems', function(table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.foreign('productId').references('uuid').inTable('products');
        table.float('unitPrice').notNullable();
        table.integer('quantity').notNullable();
        table.uuid('ownerId').notNullable();
        table.string('ownerType').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('lineItems');
}

