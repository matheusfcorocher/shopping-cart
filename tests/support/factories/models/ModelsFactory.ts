import { QueryBuilder, Model } from "objection";

interface ModelsFactory<D, A extends Model> {
  createList(list: Array<D>): Promise<Array<A>>;
  create(data: D): QueryBuilder<A, A>;
}

type CreateOne<D, A extends Model> = (data: D) => QueryBuilder<A, A>;

function factory<D, A extends Model>(createOne: CreateOne<D, A>): ModelsFactory<D, A> {
  return {
    createList: (list: Array<D>) => Promise.all(list.map((d) => createOne(d))),
    create: (data: D) => createOne(data),
  };
}

export { ModelsFactory, factory };
