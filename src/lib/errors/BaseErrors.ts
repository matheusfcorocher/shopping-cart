type Exception<M = any> = Readonly<{
  name: string;
  message: string;
  code: string;
  detail?: string;
  meta?: M;
}>;

class BaseError<M = any> extends Error implements Exception<M> {
    public readonly name: string;
  public readonly code: string;
  public readonly detail?: string | undefined;
  public readonly meta?: M;

  constructor(props: Exception<M>) {
    super();
    this.name = props.name;
    this.message = props.message;
    this.code = props.code;
    this.detail = props.detail;
    this.meta = props.meta;

    Error.captureStackTrace(this, BaseError);
  }
}

type AggregateException<M = any> = Readonly<{
    name: string;
    message: string;
    code: string;
    detail?: string;
    errors: Array<Exception>;
    meta?: M;
  }>;

class AggregateBaseError<M = any> extends Error implements AggregateException<M> {
    public readonly name: string;
    public readonly code: string;
    public readonly detail?: string | undefined;
    public readonly errors: Array<Exception>;
    public readonly meta?: M;

  constructor(props: AggregateException<M>) {
    super();
    this.name = props.name;
    this.message = props.message;
    this.code = props.code;
    this.detail = props.detail;
    this.errors = props.errors;
    this.meta = props.meta;

    Error.captureStackTrace(this, BaseError);
  }
}

type HttpException<M = any> = Readonly<{
    name: string;
    status: number;
    message: string;
    detail?: string;
    type?: string;
    instance?: string;
    hasManyErrors?: boolean;
    errors?: Array<Exception>;
    meta?: M;
  }>;

class HttpBaseError<M = any> extends Error implements HttpException<M> {
    public readonly name: string;
    public readonly status: number;
    public readonly detail?: string | undefined;
    public readonly type?: string;
    public readonly instance?: string;
    public readonly hasManyErrors?: boolean;
    public readonly errors?: Array<Exception>;
    public readonly meta?: M;

  constructor(props: HttpException<M>) {
    super();
    this.name = props.name;
    this.message = props.message;
    this.status = props.status;
    this.detail = props.detail;
    this.type = props.type;
    this.instance = props.instance;
    this.hasManyErrors = props.hasManyErrors;
    this.errors = props.errors;
    this.meta = props.meta;

    Error.captureStackTrace(this, BaseError);
  }
}

export { BaseError, AggregateBaseError, HttpBaseError};
export type { Exception, AggregateException, HttpException };
