import { app } from "../../app";
const { DatabaseHandler } = require("../support/database");

beforeAll(async () => await app.ready())
afterAll( async () => {
    await app.close();
    //Comment this line if you're not using a database
    await DatabaseHandler.closeDatabase();
});