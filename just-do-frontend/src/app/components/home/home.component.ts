import { Component } from '@angular/core';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TasksListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {}
