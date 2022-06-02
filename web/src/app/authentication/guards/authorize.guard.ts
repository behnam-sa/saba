import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({
    providedIn: 'root',
})
export class AuthorizeGuard implements CanActivate {
    constructor(public tokenService: AuthTokenService, public router: Router) {}

    canActivate(): boolean | UrlTree {
        if (this.tokenService.isLoggedIn) {
            return true;
        } else {
            return this.router.createUrlTree(['/account/login']);
        }
    }
}
