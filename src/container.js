"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
//Use Cases importations
//cart
const AddLineItem_1 = __importDefault(require("./application/Cart/AddLineItem"));
const ApplyVoucher_1 = __importDefault(require("./application/Cart/ApplyVoucher"));
const GetCurrentCart_1 = __importDefault(require("./application/Cart/GetCurrentCart"));
const RemoveLineItem_1 = __importDefault(require("./application/Cart/RemoveLineItem"));
const RemoveVoucher_1 = __importDefault(require("./application/Cart/RemoveVoucher"));
//product
const ListProducts_1 = __importDefault(require("./application/Product/ListProducts"));
//voucher
const ListVouchers_1 = __importDefault(require("./application/Voucher/ListVouchers"));
//service
const CheckoutDomainService_1 = __importDefault(require("./domain/services/CheckoutDomainService"));
//Repositories importations
const ObjectionBuyerRepository_1 = __importDefault(require("./infra/repositories/buyer/ObjectionBuyerRepository"));
const ObjectionCartRepository_1 = __importDefault(require("./infra/repositories/cart/ObjectionCartRepository"));
const ObjectionOrderRepository_1 = __importDefault(require("./infra/repositories/order/ObjectionOrderRepository"));
const ObjectionProductRepository_1 = __importDefault(require("./infra/repositories/product/ObjectionProductRepository"));
const ObjectionVoucherRepository_1 = __importDefault(require("./infra/repositories/voucher/ObjectionVoucherRepository"));
const buyerRepo = new ObjectionBuyerRepository_1.default();
const cartRepo = new ObjectionCartRepository_1.default();
const orderRepo = new ObjectionOrderRepository_1.default();
const productRepo = new ObjectionProductRepository_1.default();
const voucherRepo = new ObjectionVoucherRepository_1.default();
//Cart Use Cases
const addLineItem = new AddLineItem_1.default(cartRepo, productRepo);
const applyVoucher = new ApplyVoucher_1.default(cartRepo, voucherRepo);
const getCurrentCart = new GetCurrentCart_1.default(cartRepo);
const removeLineItem = new RemoveLineItem_1.default(cartRepo, productRepo);
const removeVoucher = new RemoveVoucher_1.default(cartRepo, voucherRepo);
//Product Use Cases
const listProducts = new ListProducts_1.default(productRepo);
//Voucher Use Cases
const listVouchers = new ListVouchers_1.default(voucherRepo);
//Services Use cases
const checkoutDomainService = new CheckoutDomainService_1.default(cartRepo, productRepo, orderRepo);
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
};
exports.container = container;
