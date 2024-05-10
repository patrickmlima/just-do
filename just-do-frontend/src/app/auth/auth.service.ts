import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginResponse } from '../shared/types/auth.type';
import { UserLogin } from '../shared/types/user.type';

const { authServer } = environment;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private uri =
    `${authServer.protocol}://${authServer.host}:` +
    `${authServer.port}/${authServer.uri}`;

  private ACCESS_TOKEN_KEY = 'access_tk';
  constructor(private httpClient: HttpClient) {}

  doLogin(credentials: UserLogin): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.uri}/login`,
      credentials,
    );
  }

  setSession(jwtToken: string) {
    if (jwtToken) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, jwtToken);
    }
  }

  getToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
}
