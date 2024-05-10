import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { AuthModule } from '../../auth/auth.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AuthModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout() {
    this.authService.deleteSession();
    this.router.navigate(['']);
  }
}
