interface DomainErrorProps {
  title: string;
  message: string;
  code: string;
  detail?: string;
}

class DomainError extends Error {
  title: string;
  message: string;
  code: string;
  detail?: string;

  constructor({ title, message, code, detail }: DomainErrorProps) {
    super();
    this.title = title;
    this.message = message;
    this.code = code;
    this.detail = detail;
  }
}

interface DomainAggregateError {
  title: string;
  code: string;
  detail?: string;
  errors: Array<DomainError>;
  message: string;
}

class DomainAggregateError extends Error {
  title: string;
  code: string;
  errors: Array<DomainError>;
  message: string;
  detail?: string;

  constructor({ errors, message, title, code, detail }: DomainAggregateError) {
    super();
    this.message = message;
    this.errors = errors;
    this.title = title;
    this.code = code;
    this.detail = detail;
  }
}

interface ApplicationErrorProps {
  title: string;
  message: string;
  code: string;
  detail?: string;
}

class ApplicationError extends Error {
  title: string;
  message: string;
  code: string;
  detail?: string;

  constructor({ title, message, code, detail }: ApplicationErrorProps) {
    super();
    this.title = title;
    this.message = message;
    this.code = code;
    this.detail = detail;
  }
}

interface InfrastructureErrorProps {
  title: string;
  message: string;
  code: string;
  detail?: string;
}

class InfrastructureError extends Error {
  title: string;
  message: string;
  code: string;
  detail?: string;

  constructor({ title, message, code, detail }: InfrastructureErrorProps) {
    super();
    this.title = title;
    this.message = message;
    this.code = code;
    this.detail = detail;
  }
}

interface HttpResponseErrorProps {
  type?: string;
  hasManyErrors?: boolean;
  title: string;
  status: number;
  message: string;
  detail?: string;
  errors?: Array<ErrorResponse>;
  instance?: string;
}

interface ErrorResponseProps {
  type?: string;
  message: string;
  instance?: string;
}

class ErrorResponse extends Error {
  type?: string;
  message: string;
  instance?: string;

  constructor({ type, message, instance }: ErrorResponseProps) {
    super();
    this.type = type;
    this.message = message;
    this.instance = instance;
  }
}

class HttpResponseError extends Error {
  type?: string;
  hasManyErrors?: boolean;
  title: string;
  status: number;
  detail?: string;
  errors?: Array<ErrorResponse>;
  instance?: string;

  constructor({
    type,
    hasManyErrors = false,
    title,
    status,
    message,
    detail,
    instance,
    errors,
  }: HttpResponseErrorProps) {
    super();
    this.type = type;
    this.hasManyErrors = hasManyErrors;
    this.title = title;
    this.status = status;
    this.message = message;
    this.detail = detail;
    this.errors = errors;
    this.instance = instance;
  }

  public toJson(): HttpResponseErrorProps {
    return {
      type: this.type,
      hasManyErrors: this.hasManyErrors,
      title: this.title,
      status: this.status,
      message: this.message,
      detail: this.detail,
      errors: this.errors,
      instance: this.instance,
    };
  }
}

const EHConverter = {
  convert: function (error: any): HttpResponseError {
    if (error?.errors) {
      return this.convertAH(error);
    }
    return this.convertEH(error);
  },
  convertEH: function (
    error: DomainError | ApplicationError | InfrastructureError
  ): HttpResponseError {
    const status = this.getStatusByCode(error.code);
    const httpResponseError = new HttpResponseError({
      title: error.title,
      status: status,
      message: error.message,
      detail: error.detail,
    });
    return httpResponseError;
  },
  convertAH: function (error: DomainAggregateError): HttpResponseError {
    const status = this.getStatusByCode(error.code);
    const httpResponseError = new HttpResponseError({
      title: error.title,
      status: status,
      message: error.message,
      detail: error.detail,
      errors: error.errors,
      hasManyErrors: true
    });
    return httpResponseError;
  },
  getStatusByCode: function (code: string): number {
    switch (code) {
      case "BADREQUEST_ERROR":
        return 400;
      case "NOTFOUND_ERROR":
        return 404;
      default:
        return 500;
    }
  },
};

export {
  HttpResponseError,
  DomainError,
  DomainAggregateError,
  ApplicationError,
  InfrastructureError,
  EHConverter,
};
