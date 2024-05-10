import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(AuthService).isAuthenticated();

  if (!isAuthenticated) {
    return inject(Router).createUrlTree(['']);
  }

  return true;
};
