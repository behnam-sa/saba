import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { UserInfo } from 'src/app/authentication/models/user-info';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { UserInfoEdit } from '../models/user-info-edit';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    public loaded = this.auth.user.pipe(map(() => true));

    public form: FormGroup = new FormGroup({
        username: new FormControl(''),
        name: new FormControl(''),
        email: new FormControl(''),
        newPassword: new FormControl(''),
    });
    public avatar: string | null = null;

    public showForm: boolean = false;
    public hidePassword: boolean = true;
    public sendingRequest: boolean = false;

    public dateTimeOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    private subscriptions: Subscription[] = [];

    constructor(
        public auth: AuthService,
        private accountService: AccountService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.auth.user.subscribe((user) => {
                this.setFormValues(user);
            })
        );
    }

    private setFormValues(user: UserInfo | null) {
        if (user === null) {
            this.router.navigate(['/account/login']);
        } else {
            this.form.setValue({
                username: user.username,
                name: user.name,
                email: user.email,
                newPassword: '',
            });
            this.avatar = user.avatar;
        }
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    public submit() {
        if (this.form.valid) {
            const edit: UserInfoEdit = {
                username: this.form.value.username,
                name: this.form.value.name,
                email: this.form.value.email,
                newPassword: this.form.value.newPassword || undefined,
                avatar: this.avatar,
            };

            this.sendingRequest = true;

            this.accountService.edit(edit).subscribe({
                next: () => {
                    this.snackBar.open('اطلاعات کاربری شما با موفقیت ویرایش شد', undefined, {
                        duration: 3000,
                        verticalPosition: 'bottom',
                        horizontalPosition: 'center',
                        panelClass: 'primary-snackbar',
                    });

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

    public avatarChanged(event: Event) {
        const reader = new FileReader();
        const files = (event?.target as HTMLInputElement)?.files;
        if (files) {
            const file = files.item(0)!;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.avatar = reader.result as string;
                this.form.patchValue({
                    avatar: reader.result,
                });
            };
        }
    }
}
