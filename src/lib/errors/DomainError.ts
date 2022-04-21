import { BaseError, Exception } from "./BaseErrors";

interface DomainErrorProps {
    name: string;
    message: string;
    code: string;
    detail?: string;
  }

namespace DomainError {
  export const create = ({name, code, message, detail} : DomainErrorProps): Exception =>
    new BaseError({ name, code, message, detail });
}

export { DomainError };
