import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', function(table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.string('name').notNullable();
        table.integer('price').notNullable();
        table.integer('available').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('products');
}
