import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthTokenService {
    private tokenSource: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.tokenValue);

    public token: Observable<string | null> = this.tokenSource.asObservable();

    constructor() {}

    public set tokenValue(value: string | null) {
        if (value === this.tokenValue) return;

        if (!value) {
            localStorage.removeItem('authToken');
        } else {
            localStorage.setItem('authToken', value);
        }
        this.tokenSource.next(value);
    }

    public get tokenValue(): string | null {
        return localStorage.getItem('authToken');
    }

    public get isLoggedIn(): boolean {
        return this.tokenValue !== null;
    }
}
