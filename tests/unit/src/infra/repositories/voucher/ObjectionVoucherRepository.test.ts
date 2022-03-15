import ModelsFactory from "../../../../../support/factories/models/ModelsFactory";

const { setupIntegrationTest } = require("../../../../support/setup");
let repository = new ObjectionVoucherRepository(
  modelsFactory.returnModel("Voucher")
);
describe("Infra :: Voucher :: ObjectionVoucherRepository", () => {
  setupIntegrationTest();
  beforeEach(async () => {
    await ModelsFactory.createList("Vouchers", [
      {
        uuid: "TEST-TEST1",
        code: "TEST1",
        type: "percentual",
        amount: 40,
      },
      {
        uuid: "TEST-TEST2",
        code: "TEST2",
        type: "fixed",
        amount: 40,
      },
      {
        uuid: "TEST-TEST3",
        code: "TEST3",
        type: "free shipping",
        amount: 2,
        minValue: 50,
      },
    ]);
  });

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
