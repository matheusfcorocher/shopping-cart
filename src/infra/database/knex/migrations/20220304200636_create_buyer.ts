import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('buyers', function(table) {
        table.increments();
        table.string('uuid').notNullable();
        table.string('name').notNullable();
        table.date('birthDate').notNullable();
        table.string('email').notNullable();
        table.string('postalCode').notNullable();
        table.string('street').notNullable();
        table.string('district').notNullable();
        table.string('district').notNullable();
        table.string('city').notNullable();
        table.string('country').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('buyers');
}
