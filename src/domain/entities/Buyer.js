"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Buyer {
    constructor({ id, name, birthDate, email, address }) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.email = email;
        this.address = address;
    }
}
exports.default = Buyer;
