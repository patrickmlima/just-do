import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, TasksListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {}
