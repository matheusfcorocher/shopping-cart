import { cartState, products } from "../../../../src/domain/entities/Cart";

import { Cart, Product, Voucher } from "../../../../src/domain/entities";
import { VoucherType } from "../../../../src/domain/entities/Voucher";

interface AbstractEntityFactory {
  cartCreatorMachine(): AbstractCartCreatorMachine;
  productCreatorMachine(): AbstractProductCreatorMachine;
  voucherCreatorMachine(): AbstractVoucherCreatorMachine;
}

class ConcreteEntityFactory implements AbstractEntityFactory {
  public cartCreatorMachine(): AbstractCartCreatorMachine {
    return new ConcreteCartCreatorMachine();
  }
  public productCreatorMachine(): AbstractProductCreatorMachine {
    return new ConcreteProductCreatorMachine();
  }
  public voucherCreatorMachine(): AbstractVoucherCreatorMachine {
    return new ConcreteVoucherCreatorMachine();
  }
}

//Cart

interface AbstractCartCreatorMachine {
  create(data: CartObject): Cart;
}

interface CartObject {
  id: number;
  products: products;
  voucher: number;
  state: cartState;
}

class ConcreteCartCreatorMachine implements AbstractCartCreatorMachine {
  public create(data: CartObject): Cart {
    const { id, products, voucher, state } = data;
    return new Cart(id, products, voucher, state);
  }
}

//Product

interface AbstractProductCreatorMachine {
  create(data: ProductObject): Product;
}

interface ProductObject {
  id: number;
  name: string;
  price: number;
  available: number;
}

class ConcreteProductCreatorMachine implements AbstractProductCreatorMachine {
  public create(data: ProductObject): Product {
    const { id, name, price, available } = data;
    return new Product(id, name, price, available);
  }
}

//Voucher

interface AbstractVoucherCreatorMachine {
  create(data: VoucherObject): Voucher;
}

interface VoucherObject {
  id: number;
  code: string;
  type: VoucherType;
  amount: number;
  minValue?: number;
}

class ConcreteVoucherCreatorMachine implements AbstractVoucherCreatorMachine {
  public create(data: VoucherObject): Voucher {
    const { id, code, type, amount, minValue } = data;
    return new Voucher(id, code, type, amount, minValue);
  }
}

export { ConcreteEntityFactory };
