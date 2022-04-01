"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable("orders", function (table) {
        table.increments();
        table.uuid("uuid").notNullable().unique();
        table.uuid("buyerId").references('uuid').inTable('buyers');
        table.float('discount').notNullable();
        table.string("paymentMethod").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('orders');
}
exports.down = down;
