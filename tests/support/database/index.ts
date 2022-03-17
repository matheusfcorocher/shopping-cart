import knexInstance from "../../../src/infra/database/knex/knex";

const DatabaseHandler = {
  cleanDatabase: async () => {
    const tableNames = [
      "orders",
      "carts",
      "lineItems",
      "vouchers",
      "products",
      "buyers",
    ];
    await tableNames.reduce((acc, name) => {
      return acc.then(() => knexInstance(name).delete());
    }, Promise.resolve(0));

    return Promise.resolve("Database was cleared!");
  },
  closeDatabase: async () => {
    return knexInstance.destroy();
  },
};

export = { DatabaseHandler };
