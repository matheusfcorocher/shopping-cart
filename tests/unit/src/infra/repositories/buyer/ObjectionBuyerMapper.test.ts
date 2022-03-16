import { Buyer } from "../../../../../../src/domain/entities";
import { BuyerModel } from "../../../../../../src/infra/database/knex/models";
import { ObjectionBuyerMapper } from "../../../../../../src/infra/repositories/buyer/ObjectionBuyerMapper";
import { BuyerModelData } from "../../../../../support/factories/models/BuyerModelFactory";
describe("Infra :: Buyer :: ObjectionBuyerMapper", () => {
  describe(".toEntity", () => {
    it("returns buyer instance with buyer model passed", () => {
      const buyerModel: BuyerModel = new BuyerModel();
      const buyerObject: BuyerModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Matheus",
        birthDate: new Date("1999-08-02"),
        email: "matheus@gmail.com",
        postalCode: "142005-203",
        street: "Rua do teste",
        district: "Bairro do teste",
        city: "Piracicaba",
        country: "Brazil",
      };
      buyerModel.$setJson(buyerObject);
      const {
        uuid,
        name,
        birthDate,
        email,
        postalCode,
        street,
        district,
        city,
        country,
      } = buyerObject;
      const address = { postalCode, street, district, city, country };
      const expected = new Buyer({
        id: uuid,
        name,
        birthDate,
        email,
        address,
      });

      expect(ObjectionBuyerMapper.toEntity(buyerModel)).toEqual(expected);
    });
  });

  describe(".toDatabase", () => {
    it("returns prepared object to be persisted", () => {
      const buyerObject: BuyerModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Matheus",
        birthDate: new Date("1999-08-02"),
        email: "matheus@gmail.com",
        postalCode: "142005-203",
        street: "Rua do teste",
        district: "Bairro do teste",
        city: "Piracicaba",
        country: "Brazil",
      };
      const {
        uuid,
        name,
        birthDate,
        email,
        postalCode,
        street,
        district,
        city,
        country,
      } = buyerObject;
      const address = { postalCode, street, district, city, country };
      const buyer = new Buyer({
        id: uuid,
        name,
        birthDate,
        email,
        address,
      });
      const expected = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Matheus",
        birthDate: new Date("1999-08-02"),
        email: "matheus@gmail.com",
        postalCode: "142005-203",
        street: "Rua do teste",
        district: "Bairro do teste",
        city: "Piracicaba",
        country: "Brazil",
      };

      expect(ObjectionBuyerMapper.toDatabase(buyer)).toEqual(expected);
    });
  });
});
