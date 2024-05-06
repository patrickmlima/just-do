import { GenericPaginator } from '../types/pagination';

export class PaginatedData<T> {
  page: number;
  total: number;
  size: number;
  data: T;

  constructor(paginatedData: GenericPaginator<T>) {
    const { page, total, size, data } = paginatedData;
    this.page = page;
    this.total = total;
    this.size = size;
    this.data = data;
  }
}
