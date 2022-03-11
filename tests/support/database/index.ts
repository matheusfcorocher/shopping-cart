import knexInstance from "../../../src/infra/database/knex/knex";

const DatabaseHandler = {
    cleanDatabase: () => {
        return knexInstance;
    },
    closeDatabase: async () => {
        return knexInstance.destroy();
    },
};

export = { DatabaseHandler };

