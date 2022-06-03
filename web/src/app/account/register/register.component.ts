import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        username: new FormControl(''),
        name: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
    });

    public hidePassword: boolean = true;
    public sendingRequest: boolean = false;

    constructor(
        private accountService: AccountService,
        private auth: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    public submit() {
        if (this.form.valid) {
            this.sendingRequest = true;

            this.accountService.register(this.form.value).subscribe({
                next: () => this.registerSucceeded(),
                error: (error) => this.showError(error),
            });
        }
    }

    private registerSucceeded() {
        this.snackBar.open('ثبت نام با موفقیت انجام شد', undefined, {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'primary-snackbar',
        });

        this.auth.user.pipe(first((user) => user !== null)).subscribe(() => {
            this.router.navigate(['/courses/mine']);
            this.sendingRequest = false;
        });
    }

    private showError(error: any) {
        if (error instanceof HttpErrorResponse) {
            const message = error.error?.message ?? 'خطا در برقراری ارتباط با سرور';
            this.snackBar.open(message, undefined, {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                panelClass: 'warn-snackbar',
            });
        }
        this.sendingRequest = false;
    }
}
