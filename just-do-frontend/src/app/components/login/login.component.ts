import { Component, inject, signal, TemplateRef } from '@angular/core';
import { UserLogin } from '../../shared/types/user.type';
import { FormsModule } from '@angular/forms';
import { NgbAlert, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { LoginResponse } from '../../shared/types/auth.type';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, NgbAlert],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent {
  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | undefined;
  userLogin: UserLogin = { username: '', password: '' };
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  openLoginModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  submitData() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const successCb = (value: LoginResponse) => {
      const response = value as LoginResponse;
      if (response.access_token) {
        this.authService.setSession(response.access_token);
        this.modalRef?.close();
        this.router.navigate(['home']);
      }
    };

    const finallyCb = () => {
      this.isLoading.set(false);
      this.userLogin = { username: '', password: '' };
    };

    this.authService.doLogin(this.userLogin).subscribe({
      next: successCb,
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message || err?.message);
      },
      complete: finallyCb,
    });
  }
}
