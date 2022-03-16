import { Product } from "../../../../../../src/domain/entities";
import { ProductModel } from "../../../../../../src/infra/database/knex/models";
import { ObjectionProductMapper } from "../../../../../../src/infra/repositories/product/ObjectionProductMapper";
import { ProductModelData } from "../../../../../support/factories/models/ProductModelFactory";
describe("Infra :: Product :: ObjectionProductMapper", () => {
  describe(".toEntity", () => {
    it("returns product instance with product model passed", () => {
      const productModel: ProductModel = new ProductModel();
      const productObject: ProductModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Avocado",
        price: 9.99,
        available: 100,
      };
      productModel.$setJson(productObject);
      const { uuid, name, price, available } = productObject;
      const expected = new Product({
        id: uuid,
        name,
        price,
        available,
      });

      expect(ObjectionProductMapper.toEntity(productModel)).toEqual(expected);
    });
  });

  describe(".toDatabase", () => {
    it("returns prepared object to be persisted", () => {
      const productObject: ProductModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Avocado",
        price: 9.99,
        available: 100,
      };
      const { uuid, name, price, available } = productObject;
      const product = new Product({
        id: uuid,
        name,
        price,
        available,
      });
      const expected = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Avocado",
        price: 9.99,
        available: 100,
      };

      expect(ObjectionProductMapper.toDatabase(product)).toEqual(expected);
    });
  });
});