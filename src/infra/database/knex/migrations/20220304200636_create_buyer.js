"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('buyers', function (table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.string('name').notNullable();
        table.date('birthDate').notNullable();
        table.string('email').notNullable();
        table.string('postalCode').notNullable();
        table.string('street').notNullable();
        table.string('district').notNullable();
        table.string('city').notNullable();
        table.string('country').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('buyers');
}
exports.down = down;
