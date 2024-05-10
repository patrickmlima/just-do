import { Component, EventEmitter, Input, signal } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../shared/types/task.type';
import { UserTaskService } from '../../shared/user-task.service';

@Component({
  selector: 'app-task-complete',
  standalone: true,
  imports: [NgbTooltip],
  templateUrl: './task-complete.component.html',
  styleUrl: './task-complete.component.sass',
})
export class TaskCompleteComponent {
  isLoading = signal(false);

  @Input()
  task: Task | undefined;

  @Input()
  taskCompletionEvents: EventEmitter<Task> | undefined;

  constructor(private readonly taskService: UserTaskService) {}

  changeTaskCompletion() {
    this.isLoading.set(true);

    this.taskService
      .patch(this.task!.id, {
        isCompleted: !this.task!.isCompleted,
      })
      .subscribe({
        next: () => {
          this.taskCompletionEvents?.emit(this.task);
        },
        error: (err: any) => {
          console.error(err);
        },
        complete: () => this.isLoading.set(false),
      });
  }
}
