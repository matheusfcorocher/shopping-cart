import { BaseError, Exception } from "./BaseErrors";

interface ApplicationErrorProps {
    name: string;
    message: string;
    code: string;
    detail?: string;
  }

namespace ApplicationError {
  export const create = ({name, code, message, detail} : ApplicationErrorProps): Exception =>
    new BaseError({ name, code, message, detail });
}

export { ApplicationError };
