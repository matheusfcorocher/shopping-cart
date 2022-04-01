"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItem = void 0;
class LineItem {
    constructor(productId, unitPrice, quantity) {
        this.productId = productId;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }
}
exports.LineItem = LineItem;
class Cart {
    constructor({ id, buyerId, lineItems, appliedVoucher }) {
        this.id = id;
        this.buyerId = buyerId;
        this.lineItems = lineItems;
        this.appliedVoucher = appliedVoucher;
    }
    get discount() {
        return this.appliedVoucher
            ? this.appliedVoucher.apply(this.shipping, this.subtotal)
            : 0;
    }
    get subtotal() {
        return this.lineItems
            ? this.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
            : 0;
    }
    get shipping() {
        if (this.subtotal > 400) {
            return 0;
        }
        const shippingWeight = this.calculateCartWeight();
        if (shippingWeight <= 10)
            return 30;
        return this.calculateShippingCost(shippingWeight);
    }
    get total() {
        return this.subtotal + this.shipping - this.discount;
    }
    addLineItem(lineItemData) {
        const item = this.lineItems.find(item => item.productId.normalize() === lineItemData.productId.normalize());
        if (item) {
            item.quantity += 1;
            const index = this.lineItems.findIndex(lineItem => lineItem.productId.normalize() === lineItemData.productId.normalize());
            this.lineItems[index] = item;
        }
        else {
            const newLineItem = new LineItem(lineItemData.productId, lineItemData.price, 1);
            this.lineItems = [...this.lineItems, newLineItem];
        }
    }
    applyVoucher(appliedVoucher) {
        this.appliedVoucher = appliedVoucher;
    }
    removeLineItem(productId) {
        const item = this.lineItems.find(item => item.productId.normalize() === productId.normalize());
        if (item) {
            item.quantity -= 1;
            const index = this.lineItems.findIndex(lineItem => lineItem.productId.normalize() === productId.normalize());
            if (item.quantity <= 0)
                this.lineItems.splice(index, 1);
            else
                this.lineItems[index] = item;
        }
        else {
            throw new Error(`Item with productId ${productId} wasn't found in cart!`);
        }
    }
    removeVoucher() {
        this.appliedVoucher = undefined;
    }
    calculateCartWeight() {
        return this.lineItems
            ? this.lineItems.reduce((acc, item) => acc + item.quantity, 0)
            : 0;
    }
    calculateShippingCost(weight) {
        //If weight is above 10kg, will charge $7 for each
        //5kg that cart has
        return Math.floor((weight - 10) / 5) * 7 + 30;
    }
}
exports.default = Cart;
