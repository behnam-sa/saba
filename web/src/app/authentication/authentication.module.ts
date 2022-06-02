import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthTokenService } from './services/auth-token.service';
import { AuthService } from './services/auth.service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [AuthTokenService, AuthService],
})
export class AuthenticationModule {}
