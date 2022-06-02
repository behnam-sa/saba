import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
    });

    public hidePassword: boolean = true;
    public sendingRequest: boolean = false;

    constructor(private accountService: AccountService, private router: Router, private snackBar: MatSnackBar) {}

    public ngOnInit(): void {}

    public submit() {
        if (this.form.valid) {
            this.sendingRequest = true;

            this.accountService.login(this.form.value).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                    this.sendingRequest = false;
                },
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        const message = error.error?.message ?? 'خطا در برقراری ارتباط با سرور';
                        this.snackBar.open(message, undefined, {
                            duration: 3000,
                            verticalPosition: 'bottom',
                            horizontalPosition: 'center',
                            panelClass: 'warn-snackbar',
                        });
                    }
                    console.log(error);
                    this.sendingRequest = false;
                },
            });
        }
    }
}
