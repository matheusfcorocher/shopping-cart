"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('products', function (table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.string('name').notNullable();
        table.float('price').notNullable();
        table.integer('available').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('products');
}
exports.down = down;
