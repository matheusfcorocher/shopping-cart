import { QueryBuilder, Model } from "objection";
export default function mockModel(model: typeof Model) {
  const query = QueryBuilder.forClass(model);
  jest.spyOn(model, "query").mockReturnValue(query);
  return query;
}
