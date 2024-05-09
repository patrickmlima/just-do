import { Component, inject, TemplateRef } from '@angular/core';
import { UserLogin } from '../shared/types/user.type';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor() {}

  openLoginModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(`Closed with: ${result}`);
        console.log('data ', this.userLogin);
      });
  }

  submitData() {}
}
