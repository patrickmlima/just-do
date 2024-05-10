import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getAccessToken();
  const tokenType = inject(AuthService).accessTokenType;
  const tokenAuth = `${tokenType} ${token}`;

  const authedRequest = req.clone({
    headers: req.headers.set('Authorization', tokenAuth),
  });

  return next(authedRequest);
};
