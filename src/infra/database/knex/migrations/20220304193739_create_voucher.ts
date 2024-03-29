import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('vouchers', function(table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.string('code').notNullable().unique();
        table.string('type').notNullable();
        table.integer('amount').notNullable();
        table.integer('minValue');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('vouchers');
}

