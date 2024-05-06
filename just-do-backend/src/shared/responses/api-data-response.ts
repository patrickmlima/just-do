export class APIDataResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
