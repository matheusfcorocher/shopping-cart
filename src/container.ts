//Use Cases importations
//cart
import {makeAddLineItem} from "./application/Cart/AddLineItem";
import {makeApplyVoucher} from "./application/Cart/ApplyVoucher";
import {makeGetCurrentCart} from "./application/Cart/GetCurrentCart";
import {makeRemoveLineItem} from "./application/Cart/RemoveLineItem";
import {makeRemoveVoucher} from "./application/Cart/RemoveVoucher";

//product
import {makeListProducts} from "./application/Product/ListProducts";

//voucher
import {makeListVouchers} from "./application/Voucher/ListVouchers";

//service
import * as Service from "./domain/services/CheckoutDomainService";

//Repositories importations
import ObjectionBuyerRepository from "./infra/repositories/buyer/ObjectionBuyerRepository";
import ObjectionCartRepository from "./infra/repositories/cart/ObjectionCartRepository";
import ObjectionOrderRepository from "./infra/repositories/order/ObjectionOrderRepository";
import ObjectionProductRepository from "./infra/repositories/product/ObjectionProductRepository";
import ObjectionVoucherRepository from "./infra/repositories/voucher/ObjectionVoucherRepository";

const buyerRepo = new ObjectionBuyerRepository();
const cartRepository = new ObjectionCartRepository();
const orderRepo = new ObjectionOrderRepository();
const productRepository = new ObjectionProductRepository();
const voucherRepository = new ObjectionVoucherRepository();

//Cart Use Cases
const addLineItem = makeAddLineItem({cartRepository, productRepository});
const applyVoucher = makeApplyVoucher({cartRepository, voucherRepository});
const getCurrentCart = makeGetCurrentCart({cartRepository});
const removeLineItem = makeRemoveLineItem({cartRepository, productRepository});
const removeVoucher = makeRemoveVoucher({cartRepository});

//Product Use Cases
const listProducts = makeListProducts({productRepository});

//Voucher Use Cases
const listVouchers = makeListVouchers({voucherRepository});

//Services Use cases
const checkout = Service.makeCheckout({
  cartRepository: cartRepository,
  productRepository: productRepository,
  orderRepository: orderRepo,
});

const container = {
  carts: {
    addLineItem,
    applyVoucher,
    getCurrentCart,
    removeLineItem,
    removeVoucher,
  },
  products: {
    listProducts,
  },
  vouchers: {
    listVouchers,
  },
  services: {
    checkout,
  },
};

type Container = typeof container;

export { container, Container };
