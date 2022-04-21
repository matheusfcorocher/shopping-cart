import { BaseError, Exception } from "./BaseErrors";

interface InfrastructureErrorProps {
    name: string;
    message: string;
    code: string;
    detail?: string;
  }

namespace InfrastructureError {
  export const create = ({name, code, message, detail} : InfrastructureErrorProps): Exception =>
    new BaseError({ name, code, message, detail });
}

export { InfrastructureError };
