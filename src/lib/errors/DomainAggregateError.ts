import { AggregateBaseError, AggregateException, BaseError, Exception } from "./BaseErrors";

interface DomainAggregateErrorProps {
  name: string;
  code: string;
  detail?: string;
  errors: Array<Exception>;
  message: string;
}

namespace DomainAggregateError {
  export const create = ({
    name,
    code,
    message,
    detail,
    errors
  }: DomainAggregateErrorProps): AggregateException =>
    new AggregateBaseError({ name, code, message, detail, errors });
}

export { DomainAggregateError };
