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

interface ModelsFactory {
  createList(list: Array<DataModels>): Promise<any>;
  create(data: DataModels): Promise<any>;
}

export { ModelsFactory };
