const { DatabaseHandler } = require("../database");

const setupIntegrationTest = ()=> {
  //Comment this line if you're not using a database
  beforeEach(async () => {
    await DatabaseHandler.cleanDatabase()
  });
};

export = { setupIntegrationTest };