import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Task, TaskCreateDto, TaskPatchDto } from './types/task.type';
import { DataResponse } from './types/api.type';

const { mainServer } = environment;

@Injectable({
  providedIn: 'root',
})
export class UserTaskService {
  private uri =
    `${mainServer.protocol}://${mainServer.host}:${mainServer.port}/` +
    `${mainServer.uri}`;
  private url = `${this.uri}/tasks`;

  constructor(private readonly httpClient: HttpClient) {}

  list(): Observable<DataResponse<Task[]>> {
    console.log('URL ', this.url);
    return this.httpClient.get<DataResponse<Task[]>>(`${this.url}`);
  }

  get(id: number): Observable<Task> {
    return this.httpClient.get<Task>(`${this.url}/${id}`);
  }

  post(task: TaskCreateDto) {
    return this.httpClient.post(`${this.url}`, task);
  }

  patch(id: number, data: Partial<TaskPatchDto>) {
    return this.httpClient.patch<Task>(`${this.httpClient}/${id}`, data);
  }

  delete(id: number) {
    return this.httpClient.delete(`${this.httpClient}/${id}`);
  }
}
