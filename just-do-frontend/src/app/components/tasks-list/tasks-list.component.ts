import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Task } from '../../shared/types/task.type';
import { UserTaskService } from '../../shared/user-task.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DataResponse } from '../../shared/types/api.type';
import { NewTaskComponent } from '../new-task/new-task.component';

@Component({
  selector: 'tasks-list',
  standalone: true,
  imports: [CommonModule, SharedModule, NewTaskComponent],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.sass',
})
export class TasksListComponent implements OnInit, OnDestroy {
  tasksList: Task[] = [];
  isLoading = signal(false);

  newTaskCreated = new EventEmitter(false);

  constructor(private readonly userTaskService: UserTaskService) {}

  ngOnInit(): void {
    this.loadTasks();

    this.newTaskCreated.subscribe(() => {
      this.loadTasks();
    });
  }

  ngOnDestroy(): void {
    this.newTaskCreated.unsubscribe();
  }

  private loadTasks() {
    const successCb = (response: DataResponse<Task[]>) => {
      this.tasksList = response.data;
    };

    const errorCb = (err: any) => console.error(err);

    const onCompleteCb = () => this.isLoading.set(false);

    this.userTaskService.list().subscribe({
      next: successCb,
      error: errorCb,
      complete: onCompleteCb,
    });
  }
}
