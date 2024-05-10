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
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TaskCompleteComponent } from '../task-complete/task-complete.component';

@Component({
  selector: 'tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NewTaskComponent,
    DeleteTaskComponent,
    TaskCompleteComponent,
    NgbTooltip,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.sass',
})
export class TasksListComponent implements OnInit, OnDestroy {
  tasksList: Task[] = [];
  isLoading = signal(false);

  taskListChanges = new EventEmitter(false);

  constructor(private readonly userTaskService: UserTaskService) {}

  ngOnInit(): void {
    this.loadTasks();

    this.taskListChanges.subscribe(() => {
      this.loadTasks();
    });
  }

  ngOnDestroy(): void {
    this.taskListChanges.unsubscribe();
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
