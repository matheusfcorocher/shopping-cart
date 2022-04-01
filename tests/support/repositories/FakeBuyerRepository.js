"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeBuyerRepository = void 0;
const uuid_1 = require("uuid");
class FakeBuyerRepository {
    constructor(buyers) {
        this.buyers = buyers;
    }
    getAllBuyers() {
        return Promise.resolve(this.buyers);
    }
    getNextId() {
        return (0, uuid_1.v4)();
    }
    store(buyer) {
        this.buyers.push(buyer);
        return Promise.resolve(buyer);
    }
}
exports.FakeBuyerRepository = FakeBuyerRepository;
