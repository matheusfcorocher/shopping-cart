import { LineItem } from "../../../../../../src/domain/entities/Cart";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import { LineItemModel } from "../../../../../../src/infra/database/knex/models/LineItemModel";
import { ObjectionLineItemMapper } from "../../../../../../src/infra/repositories/lineItem/ObjectionLineItemMapper";
import { LineItemModelData } from "../../../../../support/factories/models/LineItemModelFactory";

describe("Infra :: LineItem :: ObjectionLineItemMapper", () => {
  describe(".toEntity", () => {
    it("returns lineItem instance with lineItem model passed", () => {
      const lineItemModel: LineItemModel = new LineItemModel();
      const lineItemObject: LineItemModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        productId: "2a20283a-2371-441f-af6e-899fe63def5c",
        unitPrice: 999,
        quantity: 10,
        ownerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        ownerType: "cart",
      };
      lineItemModel.$setJson(lineItemObject);
      const { productId, unitPrice, quantity } = lineItemObject;
      const expected = new LineItem(productId, createMoney(unitPrice), quantity);

      expect(JSON.stringify(ObjectionLineItemMapper.toEntity(lineItemModel))).toEqual(JSON.stringify(expected));
    });
  });

  describe(".toDatabase", () => {
    it("returns prepared object to be persisted", () => {
      const lineItemObject: LineItemModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        productId: "2a20283a-2371-441f-af6e-899fe63def5c",
        unitPrice: 999,
        quantity: 10,
        ownerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        ownerType: "cart",
      };
      const { uuid, productId, unitPrice, quantity, ownerId, ownerType } =
        lineItemObject;
      const lineItem = new LineItem(productId, createMoney(unitPrice), quantity);
      const props = { uuid, ownerId, ownerType };
      const expected = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        productId: "2a20283a-2371-441f-af6e-899fe63def5c",
        unitPrice: 999,
        quantity: 10,
        ownerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        ownerType: "cart",
      };

      expect(ObjectionLineItemMapper.toDatabase(lineItem, props)).toEqual(
        expected
      );
    });
  });
});
