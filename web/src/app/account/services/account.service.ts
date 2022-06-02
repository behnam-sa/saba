import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthTokenService } from 'src/app/authentication/services/auth-token.service';
import { AuthService } from '../../authentication/services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserInfoEdit } from '../models/user-info-edit';
import { UserLoginRequest } from '../models/user-login-request';
import { UserLoginResponse } from '../models/user-login-response';
import { UserRegisterRequest } from '../models/user-register-request';
import { UserRegisterResponse } from '../models/user-register-response';

@Injectable()
export class AccountService {
    constructor(private api: ApiService, private tokenService: AuthTokenService, private auth: AuthService) {}

    public login(info: UserLoginRequest): Observable<UserLoginResponse> {
        return this.api.post<UserLoginResponse>('account/login', info).pipe(
            tap((response) => {
                this.tokenService.tokenValue = response.token;
            })
        );
    }

    public register(info: UserRegisterRequest): Observable<UserRegisterResponse> {
        return this.api.post<UserRegisterResponse>('account/register', info).pipe(
            tap((response) => {
                this.tokenService.tokenValue = response.token;
            })
        );
    }

    public edit(info: UserInfoEdit): Observable<void> {
        return this.api.post<void>('account/edit', info).pipe(
            tap(() => {
                this.auth.getUser().subscribe();
            })
        );
    }
}
