import * as Cart from "../../../domain/entities/Cart";
import { createMoney } from "../../../domain/valueObjects/Money";
import { LineItemModel } from "../../database/knex/models/LineItemModel";

interface AdditionalProps {
    uuid: string;
    ownerId: string;
    ownerType: string;
}

const ObjectionLineItemMapper = {
  toEntity(lineItemModel: LineItemModel) {
    const { productId, unitPrice, quantity } = lineItemModel;

    return Cart.createLineItem({productId, unitPrice: createMoney(unitPrice), quantity});
  },
  toDatabase(lineItem: Cart.LineItem, additionalProps: AdditionalProps) {
    const { productId, unitPrice, quantity } = lineItem;
    const { uuid, ownerId, ownerType } = additionalProps;
    return {
      uuid,
      productId,
      unitPrice: unitPrice.getAmount(),
      quantity,
      ownerId,
      ownerType
    };
  },
};

export { ObjectionLineItemMapper };
