import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../authentication/services/auth-token.service';
import { ConfigService } from './config.service';

@Injectable()
export class ApiService {
    private HEADERS: { [header: string]: string } = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
    };

    private get headers() {
        const headers = { ...this.HEADERS };
        if (this.tokenService.isLoggedIn) {
            headers['Authorization'] = `Bearer ${this.tokenService.tokenValue}`;
        }
        return headers;
    }

    private apiUrl: string;

    constructor(private http: HttpClient, private tokenService: AuthTokenService, config: ConfigService) {
        this.apiUrl = config.apiBaseUrl;
    }

    public get<T>(path: string): Observable<T> {
        return this.http.get<T>(this.apiUrl + path, {
            headers: this.headers,
        });
    }

    public post<T>(path: string, body?: any): Observable<T> {
        return this.http.post<T>(this.apiUrl + path, body, {
            headers: this.headers,
        });
    }

    public put<T>(path: string, body?: any): Observable<T> {
        return this.http.put<T>(this.apiUrl + path, body, {
            headers: this.headers,
        });
    }

    public delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(this.apiUrl + path, {
            headers: this.headers,
        });
    }
}
