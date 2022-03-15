import knexInstance from "../../../src/infra/database/knex/knex";

const DatabaseHandler = {
  cleanDatabase: () => {
    const tableNames = [
        'vouchers',
        'products',
        'buyers',
        'lineItems',
        'carts',
        'orders',
    ];
    const promises = tableNames.map((name) => 
        knexInstance(name).delete()
    );
    return Promise.all(promises);
  },
  closeDatabase: async () => {
    return knexInstance.destroy();
  },
};

export = { DatabaseHandler };
