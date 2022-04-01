"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor({ id, buyerId, lineItems, discount, paymentMethod }) {
        this.id = id;
        this.buyerId = buyerId;
        this.lineItems = lineItems;
        this.discount = discount;
        this.paymentMethod = paymentMethod;
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
exports.default = Order;
