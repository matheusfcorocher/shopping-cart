"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../app");
const { DatabaseHandler } = require("../support/database");
beforeAll(async () => await app_1.app.ready());
afterAll(async () => {
    await app_1.app.close();
    //Comment this line if you're not using a database
    await DatabaseHandler.closeDatabase();
});
