import * as Order from "../../../../../../src/domain/entities/Order";
import * as Cart from "../../../../../../src/domain/entities/Cart";
import { createMoney } from "../../../../../../src/domain/valueObjects/Money";
import { OrderModel } from "../../../../../../src/infra/database/knex/models/OrderModel";
import { ObjectionOrderMapper } from "../../../../../../src/infra/repositories/order/ObjectionOrderMapper";
import { OrderModelData } from "../../../../../support/factories/models/OrderModelFactory";

describe("Infra :: Order :: ObjectionOrderMapper", () => {
  describe(".toEntity", () => {
    it("returns order instance with passed props", () => {
      const orderModel: OrderModel = new OrderModel();
      const orderObject: OrderModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        discount: 5000,
        paymentMethod: 'credit card'
      };
      orderModel.$setJson(orderObject);
      const { uuid, buyerId, discount, paymentMethod } = orderModel;

      const lineItems = [Cart.createLineItem({productId: "2a20283a-2371-441f-af6e-899fe63def5c", unitPrice: createMoney(1999), quantity: 5}), ];
      const expected = Order.createOrder({ id: uuid, buyerId, discount: createMoney(discount), paymentMethod, lineItems });

      expect(JSON.stringify(ObjectionOrderMapper.toEntity(orderModel, lineItems))).toEqual(JSON.stringify(expected));
    });
  });

  describe(".toDatabase", () => {
    it("returns prepared object to be persisted", () => {
      const lineItems = [Cart.createLineItem({productId: "2a20283a-2371-441f-af6e-899fe63def5c", unitPrice: createMoney(1999), quantity: 5}), ];

      const order = Order.createOrder({
        id: "2a20283a-2371-441f-af6e-899fe63def5c",
        buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        lineItems,
        discount: createMoney(5000),
        paymentMethod: 'credit card'
      });

      const expected: OrderModelData = {
        uuid: "2a20283a-2371-441f-af6e-899fe63def5c",
        buyerId: "2a20283a-2371-441f-af6e-899fe63def5c",
        discount: 5000,
        paymentMethod: 'credit card'
      };

      expect(ObjectionOrderMapper.toDatabase(order)).toEqual(
        expected
      );
    });
  });
});
