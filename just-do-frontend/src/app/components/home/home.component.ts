import { Component } from '@angular/core';

import { AuthModule } from '../../auth/auth.module';
import { HeaderComponent } from '../header/header.component';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, TasksListComponent, AuthModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  constructor() {}
}
