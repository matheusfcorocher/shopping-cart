import {
  BuyerModel,
  CartModel,
  LineItemModel,
  OrderModel,
  ProductModel,
  VoucherModel,
} from "../../../../src/infra/database/knex/models";
import { dbVoucherProps } from "../../../../src/infra/repositories/voucher/ObjectionVoucherMapper";

type EntityProps = dbVoucherProps;// | dbProductProps | db...

interface ModelsFactoryProps {
  createList(type: string, list: Array<any>): Promise<any>;
  create(type: string, data: any): Promise<any>;
  returnModel(type: string): any;
}

const ModelsFactory: ModelsFactoryProps = {
  createList: function (type: string, list: Array<any>): Promise<any> {
    try {
      return Promise.all(list.map((d) => this.create(type, d)));
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  create: function (type: string, data: any): Promise<any> {
    switch (type) {
      case "Buyer":
        return Promise.resolve(BuyerModel.query().insert(data)).catch((error) =>
          console.log(error)
        );
      case "Cart":
        return Promise.resolve(CartModel.query().insert(data)).catch((error) =>
          console.log(error)
        );
      case "LineItem":
        return Promise.resolve(LineItemModel.query().insert(data)).catch((error) =>
          console.log(error)
        );
      case "Order":
        return Promise.resolve(OrderModel.query().insert(data)).catch((error) =>
          console.log(error)
        );
      case "Product":
        return Promise.resolve(ProductModel.query().insert(data)).catch((error) =>
          console.log(error)
        );
      case "Voucher":
        return Promise.resolve(VoucherModel.query().insert(data)).catch((error) =>
          console.log(error)
        );
      default: {
        const validationError = new Error("Model not found Error");
        // validationError.CODE = "MODELNOTFOUND_ERROR";
        // validationError.errors = "Unknown Model type";
        throw validationError;
      }
    }
  },
  returnModel: function (type: string): any {
    switch (type) {
      case "Buyer":
        return BuyerModel;
      case "Cart":
        return CartModel;
      case "LineItem":
        return LineItemModel;
      case "Order":
        return OrderModel;
      case "Product":
        return ProductModel;
      case "Voucher":
        return VoucherModel;
      default: {
        const validationError = new Error("Model not found Error");
        // validationError.CODE = "MODELNOTFOUND_ERROR";
        // validationError.errors = "Unknown Model type";
        throw validationError;
      }
    }
  },
};

module.exports = { ModelsFactory };
