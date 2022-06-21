import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlphabeticalNumberingService } from 'src/app/services/alphabetical-numbering';
import { AttemptAnswer } from '../models/attempt-answer';
import { AttemptDetails } from '../models/attempt-details';
import { AttemptStatus, attemptStatusPath } from '../models/attempt-status';
import { AnswerService } from '../services/answer.service';
import { AttemptService } from '../services/attempt.service';

@Component({
    selector: 'app-attempting',
    templateUrl: './attempting.component.html',
    styleUrls: ['./attempting.component.scss'],
})
export class AttemptingComponent implements OnInit, OnDestroy {
    private courseId?: number;
    private examId?: number;
    public attempt?: AttemptDetails;
    public loading: boolean = true;
    public currectQuestionIndex = 0;

    private subscriptions: Subscription[] = [];

    constructor(
        private attemptService: AttemptService,
        private answerService: AnswerService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        public alphabeticalNumbering: AlphabeticalNumberingService
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.paramMap.subscribe((params) => {
                this.courseId = parseInt(params.get('courseId')!);
                this.examId = parseInt(params.get('examId')!);

                this.loadData(this.courseId, this.examId);
            })
        );
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData(courseId: number, examId: number) {
        this.attemptService.getAttempt(courseId, examId).subscribe({
            next: (attempt) => {
                this.attempt = attempt;
                this.loading = false;
                if (attempt.attemptStatus !== AttemptStatus.inProgress) {
                    this.router.navigate(['..', attemptStatusPath[attempt.attemptStatus]], { relativeTo: this.route });
                }
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    public changeAnswer(answer: AttemptAnswer, selectedOption: number) {
        answer.selectedOption = selectedOption;
        this.answerService.putAnswer(this.courseId!, this.examId!, answer.id, selectedOption).subscribe({
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در ثبت پاسخ، لطفاً مجدداً تلاش کنید.';
                    this.showError(message);
                }
            },
        });
    }

    public removeAnswer(answer: AttemptAnswer) {
        answer.selectedOption = null;
        this.answerService.deleteAnswer(this.courseId!, this.examId!, answer.id).subscribe({
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در حذف پاسخ، لطفاً مجدداً تلاش کنید.';
                    this.showError(message);
                }
            },
        });
    }

    public finishAttempt() {
        this.attemptService.finishAttempt(this.courseId!, this.examId!).subscribe({
            next: () => this.router.navigate(['../result'], { relativeTo: this.route }),
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در پایان آزمون، لطفاً مجدداً تلاش کنید.';
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

    public identify(index: number, item: { id: number }) {
        return item.id;
    }
}
