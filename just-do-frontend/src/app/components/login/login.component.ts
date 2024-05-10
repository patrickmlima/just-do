import { Component, inject, signal, TemplateRef } from '@angular/core';
import { UserLogin } from '../../shared/types/user.type';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { LoginResponse } from '../../shared/types/auth.type';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent {
  private modalService = inject(NgbModal);
  userLogin: UserLogin = { username: '', password: '' };
  isLoading = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  openLoginModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.userLogin = { username: '', password: '' };
      });
  }

  submitData() {
    this.isLoading.set(true);

    const successCb = (value: LoginResponse) => {
      const response = value as LoginResponse;
      if (response.access_token) {
        this.authService.setSession(response.access_token);
        this.modalService.dismissAll();
        this.router.navigate(['home']);
      }
    };

    const finallyCb = () => this.isLoading.set(false);

    this.authService.doLogin(this.userLogin).subscribe({
      next: successCb,
      error(err) {
        console.error(err);
      },
      complete: finallyCb,
    });
  }
}
