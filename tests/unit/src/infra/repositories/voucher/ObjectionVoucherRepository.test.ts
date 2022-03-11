const { setupIntegrationTest } = require("../../../../support/setup");

// const modelsFactory = new ModelsFactory();
// const dataFactory = new DataFactory();
// let repository = new SequelizeCargosRepository(
//   modelsFactory.returnModel("Cargos")
// );
describe("Infra :: Voucher :: ObjectionVoucherRepository", () => {
  setupIntegrationTest();
//   beforeEach(async () => {
//     await modelsFactory.createList("Resources", [
//       { name: "water", weight: 100 },
//       { name: "food", weight: 300 },
//       { name: "minerals", weight: 1000 },
//     ]);

//     await modelsFactory.createList("Cargos", [
//       { cargoId: 1, resourceId: 1 },
//       { cargoId: 1, resourceId: 2 },
//       { cargoId: 1, resourceId: 3 },
//     ]);
//   });

  describe("#getAllVouchers", () => {
    describe("when cargo do exist", () => {
      it("returns cargo from the database", async () => {
        const cargo = await repository.getById(1);

        expect(cargo).toBeInstanceOf(Cargo);
        expect(cargo).toEqual(
          dataFactory.create("Cargo", { cargoId: 1, resourceIds: [1, 2, 3] })
        );
      });
    });

    describe("when cargo doesn't exist", () => {
      it("returns not found error", async () => {
        const notFoundError = new Error("Not Found Error");
        notFoundError.CODE = "NOTFOUND_ERROR";
        notFoundError.message = `Cargo with id 10 can't be found.`;
        await expect(() => repository.getById(10)).rejects.toThrow(
          notFoundError
        );
      });
    });
  });
});
