interface ModelsFactory<D, A> {
  createList(list: Array<D>): Promise<Array<A>>;
  create(data: D): Promise<A>;
}

export { ModelsFactory };
