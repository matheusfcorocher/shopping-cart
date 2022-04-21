import { AggregateBaseError, BaseError, HttpBaseError } from "./BaseErrors";

const EHConverter = {
  convert: function (error: any): HttpBaseError {
    if (error?.errors) {
      return this.convertAH(error);
    }
    return this.convertEH(error);
  },
  convertEH: function (
    error: BaseError
  ): HttpBaseError {
    const status = this.getStatusByCode(error.code);
    const httpResponseError = new HttpBaseError({
      name: error.name,
      status: status,
      message: error.message,
      detail: error.detail,
      hasManyErrors: false,
    });
    return httpResponseError;
  },
  convertAH: function (error: AggregateBaseError): HttpBaseError {
    const status = this.getStatusByCode(error.code);
    const httpResponseError = new HttpBaseError({
      name: error.name,
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
      case "VALIDATION_ERROR":
        return 400;
      case "NOTFOUND_ERROR":
        return 404;
      default:
        return 500;
    }
  },
};

export {
  EHConverter,
};
