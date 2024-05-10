import { Component, EventEmitter, inject, Input, signal } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Task, TaskCreateDto } from '../../shared/types/task.type';
import { UserTaskService } from '../../shared/user-task.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.sass',
})
export class NewTaskComponent {
  // private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | undefined;
  isLoading = signal(false);

  @Input()
  newTaskEmitter: EventEmitter<TaskCreateDto> | undefined;

  taskForm = new FormGroup({
    title: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ],
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: [Validators.maxLength(1024)],
    }),
  });

  constructor(
    private readonly taskService: UserTaskService,
    private readonly modalService: NgbModal,
  ) {}

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  submitData() {
    const { title, description } = this.taskForm.value;
    const taskData = new TaskCreateDto(title, description);
    this.isLoading.set(true);

    const next = () => {
      this.newTaskEmitter?.emit(taskData);
      this.modalRef?.close();
      this.taskForm.reset();
    };

    const error = (err: any) => {
      console.error(err);
    };

    const complete = () => {
      this.isLoading.set(false);
    };

    this.taskService.post(taskData).subscribe({
      next,
      error,
      complete,
    });
  }
}
