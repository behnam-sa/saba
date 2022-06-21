import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AttemptDetails } from '../models/attempt-details';
import { AttemptStatus, attemptStatusPath } from '../models/attempt-status';
import { AttemptService } from '../services/attempt.service';

@Component({
    selector: 'app-begin-attempt',
    templateUrl: './begin-attempt.component.html',
    styleUrls: ['./begin-attempt.component.scss'],
})
export class BeginAttemptComponent implements OnInit, OnDestroy {
    public attempt?: AttemptDetails;

    private subscriptions: Subscription[] = [];

    constructor(
        private attemptService: AttemptService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.paramMap.subscribe((paramMap) => {
                this.loadData(parseInt(paramMap.get('courseId')!), parseInt(paramMap.get('examId')!));
            })
        );
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData(courseId: number, examId: number) {
        this.attemptService.getAttempt(courseId, examId).subscribe((attempt) => {
            this.attempt = attempt;
            if (attempt.attemptStatus !== AttemptStatus.notAttempted) {
                this.router.navigate(['..', attemptStatusPath[attempt.attemptStatus]], { relativeTo: this.route });
            }
        });
    }

    public beginAttempt() {
        const courseId = parseInt(this.route.snapshot.paramMap.get('courseId')!);
        const examId = parseInt(this.route.snapshot.paramMap.get('examId')!);

        this.attemptService.beginAttempt(courseId, examId).subscribe({
            next: () => this.router.navigate(['../inprogress'], { relativeTo: this.route }),
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در شروع آزمون، لطفاً مجدداً تلاش کنید.';
                    this.showError(message);
                }
            },
        });
    }

    private showError(message: any) {
        this.snackBar.open(message, undefined, {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'warn-snackbar',
        });
    }
}
