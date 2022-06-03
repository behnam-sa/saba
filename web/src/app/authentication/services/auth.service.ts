import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { defer, map, Observable, ReplaySubject, shareReplay, Subscription, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UserInfo } from '../models/user-info';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class AuthService implements OnDestroy {
    private userSource: ReplaySubject<UserInfo | null> = new ReplaySubject<UserInfo | null>(1);

    public user: Observable<UserInfo | null> = defer(() => {
        this.getUser().subscribe();
        return this.userSource;
    }).pipe(shareReplay(1));

    private subscriptions: Subscription[] = [];

    constructor(private api: ApiService, private tokenService: AuthTokenService) {
        this.subscriptions.push(this.tokenService.token.subscribe(() => this.getUser().subscribe()));
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    public getUser(): Observable<UserInfo> {
        if (!this.tokenService.isLoggedIn) {
            this.userSource.next(null);
        }

        return this.api.get<UserInfo>('account').pipe(
            map((user) => {
                user.registraionDate = new Date(user.registraionDate);
                return user;
            }),
            tap({
                next: (userInfo) => {
                    this.userSource.next(userInfo);
                },
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) {
                            this.logOut();
                        }
                    }
                    this.userSource.next(null);
                },
            })
        );
    }

    public logOut(): void {
        this.tokenService.tokenValue = null;
    }
}
