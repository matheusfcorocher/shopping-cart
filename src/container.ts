//Use Cases importations
//cart
import AddLineItem from "./application/Cart/AddLineItem";
import ApplyVoucher from "./application/Cart/ApplyVoucher";
import GetCurrentCart from "./application/Cart/GetCurrentCart";
import RemoveLineItem from "./application/Cart/RemoveLineItem";
import RemoveVoucher from "./application/Cart/RemoveVoucher";

//product
import ListProducts from "./application/Product/ListProducts";

//voucher
import ListVouchers from "./application/Voucher/ListVouchers";

//service
import CheckoutDomainService from "./domain/services/CheckoutDomainService";

//Repositories importations
import ObjectionBuyerRepository from "./infra/repositories/buyer/ObjectionBuyerRepository";
import ObjectionCartRepository from "./infra/repositories/cart/ObjectionCartRepository";
import ObjectionOrderRepository from "./infra/repositories/order/ObjectionOrderRepository";
import ObjectionProductRepository from "./infra/repositories/product/ObjectionProductRepository";
import ObjectionVoucherRepository from "./infra/repositories/voucher/ObjectionVoucherRepository";

const buyerRepo = new ObjectionBuyerRepository();
const cartRepo = new ObjectionCartRepository();
const orderRepo = new ObjectionOrderRepository();
const productRepo = new ObjectionProductRepository();
const voucherRepo = new ObjectionVoucherRepository();

//Cart Use Cases
const addLineItem = new AddLineItem(cartRepo, productRepo);
const applyVoucher = new ApplyVoucher(cartRepo, voucherRepo);
const getCurrentCart = new GetCurrentCart(cartRepo);
const removeLineItem = new RemoveLineItem(cartRepo, productRepo);
const removeVoucher = new RemoveVoucher(cartRepo);

//Product Use Cases
const listProducts = new ListProducts(productRepo);

//Voucher Use Cases
const listVouchers = new ListVouchers(voucherRepo);

//Services Use cases
const checkoutDomainService = new CheckoutDomainService(cartRepo, productRepo, orderRepo);

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
        checkoutDomainService
    },
}

type Container = typeof container;


export { container, Container};