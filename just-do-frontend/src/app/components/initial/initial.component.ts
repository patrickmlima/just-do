import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'initial',
  standalone: true,
  imports: [LoginComponent, AuthModule],
  providers: [AuthService],
  templateUrl: './initial.component.html',
  styleUrl: './initial.component.sass',
})
export class InitialComponent {}
