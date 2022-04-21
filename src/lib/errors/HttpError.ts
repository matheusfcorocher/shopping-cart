import { Exception, HttpBaseError } from "./BaseErrors";

interface HttpErrorProps {
  name: string;
  status: number;
  message: string;
  detail?: string;
  hasManyErrors?: boolean;
  errors?: Array<Exception>;
  type?: string;
  instance?: string;
}

namespace HttpError {
  export const create = ({
    name,
    status,
    message,
    detail,
    hasManyErrors,
    errors,
    type,
    instance,
  }: HttpErrorProps): HttpErrorProps =>
    new HttpBaseError({
      name,
      status,
      message,
      detail,
      hasManyErrors,
      errors,
      type,
      instance,
    });

  export const toJson = (httpError: HttpBaseError): HttpErrorProps => {
    return {
      type: httpError.type,
      hasManyErrors: httpError.hasManyErrors,
      name: httpError.name,
      status: httpError.status,
      message: httpError.message,
      detail: httpError.detail,
      errors: httpError.errors,
      instance: httpError.instance,
    };
  };
}

export { HttpError };
