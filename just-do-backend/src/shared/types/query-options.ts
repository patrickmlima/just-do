export type FindQuery<T> = {
  filter?: Partial<T>;
};

export type SortOptions = 'ASC' | 'DESC';

export type SortQuery<T> = {
  sort?: [[key: keyof T, value: SortOptions]];
};
