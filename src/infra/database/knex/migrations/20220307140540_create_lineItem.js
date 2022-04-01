"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('lineItems', function (table) {
        table.increments();
        table.uuid('uuid').notNullable().unique();
        table.uuid('productId').references('uuid').inTable('products');
        table.float('unitPrice').notNullable();
        table.integer('quantity').notNullable();
        table.uuid('ownerId').notNullable();
        table.string('ownerType').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('lineItems');
}
exports.down = down;
