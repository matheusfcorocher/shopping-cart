"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('vouchers', function (table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.string('code').notNullable().unique();
        table.string('type').notNullable();
        table.integer('amount').notNullable();
        table.float('minValue');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('vouchers');
}
exports.down = down;
