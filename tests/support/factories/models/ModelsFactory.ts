import {
  BuyerModel,
  CartModel,
  LineItemModel,
  OrderModel,
  ProductModel,
  VoucherModel,
} from "../../../../src/infra/database/knex/models";
import { BuyerModelData } from "./BuyerModelFactory";
import { CartModelData } from "./CartModelFactory";
import { LineItemModelData } from "./LineItemModelFactory";
import { OrderModelData } from "./OrderModelFactory";
import { ProductModelData } from "./ProductModelFactory";
import { VoucherModelData } from "./VoucherModelFactory";

type DataModels =
  | BuyerModelData
  | CartModelData
  | LineItemModelData
  | OrderModelData
  | ProductModelData
  | VoucherModelData;

type ObjectionModels =
  | typeof BuyerModel
  | typeof CartModel
  | typeof LineItemModel
  | typeof OrderModel
  | typeof ProductModel
  | typeof VoucherModel;
interface ModelsFactory {
  createList(list: Array<DataModels>): Promise<any>;
  create(data: DataModels): Promise<any>;
  returnModel(): ObjectionModels;
}

export { ModelsFactory, ObjectionModels };
