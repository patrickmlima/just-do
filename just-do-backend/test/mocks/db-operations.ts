import type { UpdateResult } from 'typeorm';
import { EntityNotFoundError, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { EntityWithId } from '../../src/shared/types/entity-pk';

type ClassConstructor<C> = { new (...args: any[]): C };

export class MockDbImplementation<T extends EntityWithId> {
  private data: T[];
  private entityClass: ClassConstructor<T>;

  constructor(data: T[], entityClass: ClassConstructor<T>) {
    this.data = [...(data ?? [])];
    this.entityClass = entityClass;
  }

  private spliceItem(
    list: T[],
    where: FindOptionsWhere<T>,
    dataPatch?: QueryDeepPartialEntity<T>,
  ): [T[], number] {
    const localList = [...list];
    const itemIndex = localList.findIndex((item) => item.id === where.id);
    const hasFoundItem = itemIndex !== -1;

    if (hasFoundItem) {
      const updatedItem = dataPatch
        ? {
            ...localList[itemIndex],
            ...dataPatch,
          }
        : undefined;
      localList.splice(itemIndex, 1, updatedItem);
    }

    return [localList, hasFoundItem ? 1 : 0];
  }

  private filterPasswordKey(list: T[]): T[] {
    const filteredList = list.map<T>((item: T) => {
      const tmp = { ...item };
      delete tmp.password;
      return tmp;
    });

    return filteredList;
  }

  findAll(): Promise<T[]> {
    return Promise.resolve(this.filterPasswordKey(this.data));
  }

  findOneOrFail(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T> {
    const options = where as FindOptionsWhere<T>;
    const foundItem = this.data?.find((item) => item?.id === options.id);
    return new Promise<T>((resolve, reject) =>
      foundItem
        ? resolve(this.filterPasswordKey([foundItem]).at(0))
        : reject(new EntityNotFoundError(this.entityClass, options)),
    );
  }

  updateOne(
    criteria: unknown,
    patch: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    const options = criteria as FindOptionsWhere<T>;

    const [data, affected] = this.spliceItem(this.data, options, patch);
    this.data = data;

    return new Promise<UpdateResult>((resolve) => {
      return resolve({
        affected,
        raw: '',
        generatedMaps: [],
      });
    });
  }

  delete(where: unknown) {
    const options = where as FindOptionsWhere<T>;

    const [data, affected] = this.spliceItem(this.data, options);
    this.data = data;

    return new Promise<UpdateResult>((resolve) => {
      return resolve({
        affected,
        raw: '',
        generatedMaps: [],
      });
    });
  }
}
