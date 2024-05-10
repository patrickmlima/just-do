import { Component, EventEmitter, Input, signal } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserTaskService } from '../../shared/user-task.service';
import { Task } from '../../shared/types/task.type';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.sass',
})
export class DeleteTaskComponent {
  private modalRef: NgbModalRef | undefined;

  isLoading = signal(false);

  @Input()
  task: Task | undefined;

  @Input()
  taskDeleteEvents: EventEmitter<Task> | undefined;

  constructor(
    private readonly modalService: NgbModal,
    private readonly taskService: UserTaskService,
  ) {}

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  positive() {
    this.isLoading.set(true);
    this.taskService.delete(this.task!.id).subscribe({
      next: () => {
        this.modalRef?.close();
        this.taskDeleteEvents!.emit(this.task);
      },
      error: (err) => console.error(err),
      complete: () => this.isLoading.set(false),
    });
  }

  negative() {
    this.modalRef?.close();
  }
}
