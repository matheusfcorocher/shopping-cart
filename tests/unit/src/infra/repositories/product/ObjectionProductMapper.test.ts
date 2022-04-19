import * as Product from "../../../../../../src/domain/entities/Product";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import { ProductModel } from "../../../../../../src/infra/database/knex/models/ProductModel";
import { ObjectionProductMapper } from "../../../../../../src/infra/repositories/product/ObjectionProductMapper";
import { ProductModelData } from "../../../../../support/factories/models/ProductModelFactory";
describe("Infra :: Product :: ObjectionProductMapper", () => {
  describe(".toEntity", () => {
    it("returns product instance with product model passed", () => {
      const productModel: ProductModel = new ProductModel();
      const productObject: ProductModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Avocado",
        price: 999,
        available: 100,
      };
      productModel.$setJson(productObject);
      const { uuid, name, price, available } = productObject;
      const expected = Product.createProduct({
        id: uuid,
        name,
        price: createMoney(price),
        available,
      });
  
      expect(JSON.stringify(ObjectionProductMapper.toEntity(productModel))).toEqual(JSON.stringify(expected));
    });
  });

  describe(".toDatabase", () => {
    it("returns prepared object to be persisted", () => {
      const productObject: ProductModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Avocado",
        price: 999,
        available: 100,
      };
      const { uuid, name, price, available } = productObject;
      const product = Product.createProduct({
        id: uuid,
        name,
        price: createMoney(price),
        available,
      });
      const expected = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        name: "Avocado",
        price: 999,
        available: 100,
      };

      expect(ObjectionProductMapper.toDatabase(product)).toEqual(expected);
    });
  });
});
