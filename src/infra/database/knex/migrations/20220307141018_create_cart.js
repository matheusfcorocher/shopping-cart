"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable("carts", function (table) {
        table.increments();
        table.uuid("uuid").notNullable().unique();
        table.uuid("buyerId").references('uuid').inTable('buyers');
        table.uuid("voucherId").references('uuid').inTable('vouchers'); //AppliedVoucher field
        table.string("type"); //AppliedVoucher field
        table.integer("amount"); //AppliedVoucher field
        table.float("minValue"); //AppliedVoucher field
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('carts');
}
exports.down = down;
