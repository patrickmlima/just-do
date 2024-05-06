export type PaginationProperties = {
  page: number;
  total: number;
  size: number;
};

export type GenericPaginator<D> = PaginationProperties & {
  data: D;
};
