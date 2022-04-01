"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseError = exports.DbError = void 0;
class BaseError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class DbError extends BaseError {
    constructor({ title, status, detail, stack }) {
        super();
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.stack = stack;
    }
}
exports.DbError = DbError;
class HttpResponseError extends BaseError {
    constructor({ type, title, status, detail, instance }) {
        super();
        this.type = type;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
    }
    toJson() {
        return {
            type: this.type,
            title: this.title,
            status: this.status,
            detail: this.detail,
            instance: this.instance,
        };
    }
}
exports.HttpResponseError = HttpResponseError;
