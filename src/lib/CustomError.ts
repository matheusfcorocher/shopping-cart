class BaseError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, new.target.prototype)        
    }
}

interface DbErrorProps {
    title: string;
    status: number;
    message: string;
    detail: string;
    stack?: string;
}

class DbError extends BaseError {
    title: string;
    status: number;
    message: string;
    detail: string;
    stack?: string;

    constructor({title, status, message, detail, stack} : DbErrorProps) {        
        super();
        this.title = title;
        this.status = status;
        this.message = message;
        this.detail = detail;
        this.stack = stack;
    }
}

interface HttpResponseErrorProps {
    type?: string;
    title: string;
    status: number;
    message: string;
    detail: string;
    instance?: string;
}

class HttpResponseError extends BaseError {
    type?: string;
    title: string;
    status: number;
    detail: string;
    instance?: string;

    constructor({type, title, status, message, detail, instance} : HttpResponseErrorProps) {        
        super();
        this.type = type;
        this.title = title;
        this.status = status;
        this.message = message;
        this.detail = detail;
        this.instance = instance;
    }

    public toJson() : HttpResponseErrorProps{
        return {
            type: this.type,
            title: this.title,
            status: this.status,
            message: this.message,
            detail: this.detail,
            instance: this.instance,
        }
    }
}

export {DbError, HttpResponseError};